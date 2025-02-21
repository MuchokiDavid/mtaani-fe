# MtaaniApp - Property Management System

MtaaniApp is a property management system built with Django and React. It provides functionalities for managing tenants, landlords, properties, rooms, payments, bookings, maintenance requests, complaints, and more.

## Features

- **User Management**: Custom user model with roles for tenants, landlords, and admins.
- **Tenant Management**: Manage tenant details, leases, and payments.
- **Landlord Management**: Manage landlord details and properties.
- **Property Management**: Add and manage properties, including availability and images.
- **Room Management**: Manage rooms within properties.
- **Payment and Booking**: Facilitate payments and booking of properties by tenants.
- **Maintenance Requests**: Tenants can request maintenance for properties and rooms.
- **Complaints**: Tenants can submit complaints regarding properties.
- **Announcements**: Landlords can post announcements for tenants.
- **Notifications**: Users receive notifications related to their properties and activities.
- **Feedback**: Tenants can provide feedback on properties and landlords.

## Technologies Used

- **Backend**: Django, Django Rest Framework
- **Frontend**: React
- **Database**: PostgreSQL (or other relational databases)
- **Authentication**: Custom user model with JWT authentication
- **Image Upload**: Django ImageField
- **File Uploads**: Django FileField

## Installation

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mtaaniapp.git
   cd mtaaniapp/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser to access the Django admin:
   ```bash
   python manage.py createsuperuser
   ```

6. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run the frontend server:
   ```bash
   npm start
   ```

   Your app should now be running at `http://localhost:3000`.

## Usage

- **Admin Panel**: Access the Django admin panel at `http://localhost:8000/admin` to manage users, properties, payments, and more.
- **User Interaction**: Users can register as tenants or landlords, manage their properties, make payments, book properties, and submit maintenance requests.

## Models Overview

- **User**: Custom user model with roles (Tenant, Landlord, Admin), along with fields like first name, last name, email, and phone number.
- **Tenant**: A tenant can have a lease with a property and make payments.
- **Landlord**: A landlord manages properties and can post announcements.
- **Property**: Represents a property owned by a landlord, with details like name, location, and description.
- **Room**: Rooms within a property that tenants can book.
- **Payment**: Represents a payment made by a tenant for booking a property or room.
- **Booking**: Represents a booking made by a tenant for a property or room.
- **MaintenanceRequest**: A request made by a tenant for maintenance on a property.
- **Complaint**: A complaint made by a tenant about a property or room.
- **Announcement**: Announcements made by landlords for tenants.
- **Notification**: Notifications sent to users regarding important updates.
- **Feedback**: Feedback submitted by tenants about their stay at properties.

## Contributing

Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out to us at [your.email@example.com].
