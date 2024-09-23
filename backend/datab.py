import mysql.connector
from mysql.connector import errorcode

def create_database_if_not_exists():
    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(
            host='localhost',
            user="root",
            password="root123"
        )
        cursor = conn.cursor()

        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS grant_proposal_db")
        cursor.execute(f"USE grant_proposal_db")

        # Create user_details table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                organization_name VARCHAR(255),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                UNIQUE (email) -- Add a unique constraint (or index) on email
            );
        ''')

        # Create idea table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS idea (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_summary TEXT,
                budget_details TEXT,
                timeline TEXT,
                email VARCHAR(255)
            );
        ''')

        conn.commit()
        print(f"Database and tables created successfully.")

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print(f"Database does not exist and could not be created.")
        else:
            print(err)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_connection_and_cursor():
    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(
            host='localhost',
            user="root",
            password="root123"
        )
        cursor = conn.cursor()
        cursor.execute(f"USE grant_proposal_db")
        print("connected successfully")
        return conn, cursor
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None, None

def add_user_details( email, name, organization_name, address, city, state):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        query = '''
            INSERT INTO user_details (email, name, organization_name, address, city, state)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        values = (email, name, organization_name, address, city, state)
        cursor.execute(query, values)

        conn.commit()
        print("User details added successfully.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

def retrieve_user_details(email=None):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        if email:
            query = "SELECT * FROM grant_proposal_db.user_details WHERE email = %s"
            cursor.execute(query, (email,))
        else:
            query = "SELECT * FROM grant_proposal_dbuser_details"
            cursor.execute(query)

        rows = cursor.fetchall()
        return rows

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

def modify_user_details( email, **kwargs):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        query = "UPDATE user_details SET "
        params = []
        for key, value in kwargs.items():
            query += f"{key} = %s, "
            params.append(value)

        query = query.rstrip(', ') + " WHERE email = %s"
        params.append(email)

        cursor.execute(query, params)
        conn.commit()
        print("User details updated successfully.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

def add_idea( project_summary, budget_details, timeline, email):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        query = '''
            INSERT INTO idea (project_summary, budget_details, timeline, email)
            VALUES (%s, %s, %s, %s)
        '''
        values = (project_summary, budget_details, timeline, email)
        cursor.execute(query, values)

        conn.commit()
        print("Idea added successfully.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

def retrieve_ideas( email=None):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        if email:
            query = "SELECT * FROM idea WHERE email = %s"
            cursor.execute(query, (email,))
        else:
            query = "SELECT * FROM idea"
            cursor.execute(query)

        rows = cursor.fetchall()
        return rows

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

def modify_idea(idea_id, **kwargs):
    conn, cursor = get_connection_and_cursor()
    if not conn:
        return

    try:
        query = "UPDATE idea SET "
        params = []
        for key, value in kwargs.items():
            query += f"{key} = %s, "
            params.append(value)

        query = query.rstrip(', ') + " WHERE id = %s"
        params.append(idea_id)

        cursor.execute(query, params)
        conn.commit()
        print("Idea updated successfully.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()