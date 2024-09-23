from asyncio import open_connection
from flask import Flask, request, jsonify, send_file
from langchain_community.document_loaders import PDFPlumberLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
from fpdf import FPDF
from io import BytesIO
import os
import mysql.connector
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from datab import create_database_if_not_exists, add_user_details,retrieve_user_details,modify_user_details,add_idea,retrieve_ideas,modify_idea
load_dotenv()
create_database_if_not_exists()
app = Flask(__name__) 
openai_api_key = "sk-proj-gArJfrZUnA2PVYU86OW0T3BlbkFJgEtCw5413cdv5OHGE7iW"
os.environ["OPENAI_API_KEY"] = openai_api_key

def summarize_pdfs(pdf_bytes_1, pdf_bytes_2):
    with open("temp_uploaded_file_1.pdf", "wb") as temp_pdf_1:
        temp_pdf_1.write(pdf_bytes_1)

    with open("temp_uploaded_file_2.pdf", "wb") as temp_pdf_2:
        temp_pdf_2.write(pdf_bytes_2)

    # Load documents using PDFPlumberLoader
    pdf_loader_1 = PDFPlumberLoader("temp_uploaded_file_1.pdf")
    docs_1 = pdf_loader_1.load()

    pdf_loader_2 = PDFPlumberLoader("temp_uploaded_file_2.pdf")
    docs_2 = pdf_loader_2.load()

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks_1 = text_splitter.split_documents(docs_1)
    chunks_2 = text_splitter.split_documents(docs_2)

    # Initialize OpenAI LLM
    openai_llm = ChatOpenAI(temperature=0)

    summary_prompt_template = """
    Please summarize the following text, highlighting the scheme and its important points:

    {text}

    Summary:
    """
    prompt = PromptTemplate(input_variables=["text"], template=summary_prompt_template)
    chain = LLMChain(llm=openai_llm, prompt=prompt)

    # Generate summaries
    summaries_1 = [chain.run({"text": chunk.page_content}) for chunk in chunks_1]
    combined_summaries_1 = " ".join(summaries_1)

    summaries_2 = [chain.run({"text": chunk.page_content}) for chunk in chunks_2]
    combined_summaries_2 = " ".join(summaries_2)

    # Summarize the summaries
    summary_of_summaries_prompt_template = """
    Please summarize the following summarized text into a concise summary:

    {text}

    Final Summary:
    """
    summary_of_summaries_prompt = PromptTemplate(input_variables=["text"], template=summary_of_summaries_prompt_template)
    summary_chain = LLMChain(llm=openai_llm, prompt=summary_of_summaries_prompt)

    final_summary_1 = summary_chain.run({"text": combined_summaries_1})
    final_summary_2 = summary_chain.run({"text": combined_summaries_2})

    return final_summary_1, final_summary_2

def translate_text(text, language):
    openai_llm = ChatOpenAI(temperature=0)
    translation_prompt_template = """
    Please translate the following text into {language}:

    {text}

    Translation:
    """
    prompt = PromptTemplate(input_variables=["text", "language"], template=translation_prompt_template)
    chain = LLMChain(llm=openai_llm, prompt=prompt)
    translated_text = chain.run({"text": text, "language": language})

    return translated_text

def generate_grant_proposal(client_summary, scheme_summary, language):
    translated_client_ideas = translate_text(client_summary, language)
    translated_government_scheme = translate_text(scheme_summary, language)

    grant_proposal_template = f"""
    Please write a comprehensive grant proposal in {language} based on the following information:

    Government Scheme: {{translated_government_scheme}}

    Client's Ideas: {{translated_client_ideas}}

    The grant proposal should include:

    - Cover Letter
    - Project Narrative (Problem Statement, Project Goals and Objectives, Methodology, Evaluation Plan, Impact)
    - Budget (Budget Narrative, Budget Table)
    - Organizational Information (Overview, Experience and Accomplishments, Financial Information)
    - Letters of Support
    - Appendices
    """
    template = PromptTemplate(input_variables=["translated_government_scheme", "translated_client_ideas"], template=grant_proposal_template)
    openai_llm = ChatOpenAI(temperature=0.1)
    grant_proposal_chain = LLMChain(llm=openai_llm, prompt=template)

    grant_proposal = grant_proposal_chain.run({
        "translated_government_scheme": translated_government_scheme,
        "translated_client_ideas": translated_client_ideas
    })

    return grant_proposal

def create_text_file(grant_proposal):
    file_stream = BytesIO()
    file_stream.write(grant_proposal.encode('utf-8'))
    file_stream.seek(0)
    return file_stream

# Configure CORS to allow requests from all origins
CORS(app, resources={r"/*": {"origins": "*"}})
 
# Configuration for MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root123'
app.config['MYSQL_DB'] = 'aigrant'
 
# JWT configuration
app.config['JWT_SECRET_KEY'] = 'mndfnfdbfdmnfvsfdvmnfdbvhdfvvbfgnbv'  # Your secret key
jwt = JWTManager(app)
 
mysql = MySQL(app)
 
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
 
        if not username or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400
 
        cur = mysql.connection.cursor()
       
        # Check if the email already exists (ignore username duplicates)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cur.fetchone()
 
        if existing_user:
            cur.close()
            return jsonify({'message': 'Email already exists'}), 400
 
        # Hash the password using pbkdf2:sha256
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
 
        # Insert the new user into the database (allow duplicate usernames)
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
        mysql.connection.commit()
        cur.close()
 
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500

   
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
 
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
 
        cur = mysql.connection.cursor()
       
        # Fetch the user by email
        cur.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        cur.close()
 
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
 
        # Check if the provided password matches the hashed password in the database
        user_password_hash = user[3]  # Assuming the password is the third column
        if not check_password_hash(user_password_hash, password):
            return jsonify({'message': 'Invalid email or password'}), 401
 
        # Generate JWT token
        access_token = create_access_token(identity=email)
 
        return jsonify({'token': access_token}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error', 'error': str(e)}), 500

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    organization_name = data.get('organization_name')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
 
    add_user_details(email, name, organization_name, address, city, state)
    return jsonify({"message": "User details added successfully!"}), 200
 
# @app.route('/get_user', methods=['GET'])
# def get_user():
#     email = request.args.get('email')
#     users = retrieve_user_details(email)
#     if users:
#         return jsonify({"users": users}), 200
#     else:
#         return jsonify({"message": "No users found."}), 404



@app.route('/get_user', methods=['GET'])
def get_user():
    email = request.args.get('email')
    print(email)
    if not email:
        return jsonify({"message": "Email is required"}), 400  # Handle missing email

    users = retrieve_user_details(email)
    if users:
        return jsonify({"users": users}), 200
    else:
        return jsonify({"message": "No users found."}), 404
@app.route('/add_idea', methods=['POST'])
def add_idea_route():
    data = request.json
    
    # Check if the data is a dictionary
    if isinstance(data, dict):
        project_summary = data.get('project_summary')
        budget_details = data.get('budget_details')
        timeline = data.get('timeline')
        email = data.get('email')
        
        if not email:
            return jsonify({"message": "Email is required"}), 400
        
        add_idea(project_summary, budget_details, timeline, email)
        return jsonify({"message": "Idea added successfully!"}), 200
    else:
        return jsonify({"error": "Invalid data format. Expected a JSON object."}), 400
@app.route('/modify_user', methods=['PUT'])
def modify_user():
    data = request.json
    
    # Check if the data is a dictionary
    if isinstance(data, dict):
        email = data.get('email')
        if not email:
            return jsonify({"message": "Email is required"}), 400
        
        # Filter out 'email' from the fields to update
        updated_fields = {key: value for key, value in data.items() if key != 'email'}
        
        modify_user_details(email, **updated_fields)
        return jsonify({"message": "User details updated successfully!"}), 200
    else:
        return jsonify({"error": "Invalid data format. Expected a JSON object."}), 400

# @app.route('/modify_user', methods=['PUT'])
# def modify_user():
#     data = request.json
#     email = data.get('email')
#     updated_fields = {key: value for key, value in data.items() if key != 'email'}
 
#     modify_user_details(email, **updated_fields)
#     return jsonify({"message": "User details updated successfully!"}), 200
 
# @app.route('/add_idea', methods=['POST'])
# def add_idea_route():
#     data = request.json
#     project_summary = data.get('project_summary')
#     budget_details = data.get('budget_details')
#     timeline = data.get('timeline')
#     email = data.get('email')
 
#     add_idea(project_summary, budget_details, timeline, email)
#     return jsonify({"message": "Idea added successfully!"}), 200
 
@app.route('/get_ideas', methods=['GET'])
def get_ideas():
    email = request.args.get('email')
    ideas = retrieve_ideas(email)
    if ideas:
        return jsonify({"ideas": ideas}), 200
    else:
        return jsonify({"message": "No ideas found."}), 404
 
@app.route('/modify_idea', methods=['PUT'])
def modify_idea_route():
    data = request.json
    idea_id = data.get('id')      
    updated_fields = {key: value for key, value in data.items() if key != 'id'}
 
    modify_idea(idea_id, **updated_fields)
    return jsonify({"message": "Idea updated successfully!"}), 200
if __name__ == '__main__':
    create_database_if_not_exists()
    app.run(debug=True)





