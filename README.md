# Frontend Test for Title Management By Dalibor Stefanovic

This project is a frontend application designed to manage user titles with features like login/signup, MetaMask wallet connect, and CRUD operations for title management. It is built using React and includes integration with MetaMask for wallet connectivity, as well as JWT authentication and title management.

## Features

- **Login/Signup**: Allows users to create an account and log in.
- **Wallet Connect**: Connects to MetaMask for Ethereum wallet functionality.
- **Title Management**: Add and read titles you made(API for title delete is not yet made on backend. If you want, I would create it on backend).

## Technologies Used

- **React**: Library for building user interfaces.
- **MetaMask**: Ethereum wallet for browser integration.
- **@mui/material**: Material-UI components for styling.
- **Axios**: For handling HTTP requests.
- **Jest**: Testing framework for JavaScript.
- **React Testing Library**: For testing React components.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MetaMask**: [Install MetaMask](https://metamask.io/) (Chrome or Firefox extension)

### Setting up the Backend

1. First, clone and set up the backend API server from the following repository:
   ```bash
   git clone https://github.com/GP-Vote/hiring-task.git   
   cd hiring-task

2. Install backend dependencies:
3. Start the backend server:
   ```bash
   npm run dev

The backend server will typically run at `http://localhost:8000` (verify in the backend README or configuration). Ensure it’s running before starting the frontend.

### Setting up the Frontend

1. Clone this repository:
   ```bash
   git clone https://github.com/skydiver1007/Frontend_test.git  
   cd Frontend_test

2. Install frontend dependencies:
   ```bash
   npm install

3. Start the frontend development server:
   ```bash
   npm start

Open your browser and navigate to `http://localhost:3000`.

## Usage

### Login/Signup

Users can create an account using the **Signup** page or log in using the **Login** page. Authentication data is stored and managed via context.

### Wallet Connect

The **MetaMaskConnect** component enables users to connect their MetaMask wallet to the application. When connected, it displays the user's wallet address in a shortened format.

### Title Management

The **Title Management** page provides functionality to add and view titles associated with the logged-in user. You can access your titles only after wallet connecting via Metamask.

### Environment Variables

- **`REACT_APP_API_URL`**: Base API URL for backend services.

## Testing

This project includes unit and integration tests located in the `test` directory.

### Running Tests

To run the tests:  

`npm test`  


### Test Coverage

- **Authentication**: Tests for login and signup functionalities.
- **MetaMaskConnect component**: Tests for connecting and disconnecting the wallet, and displaying the wallet address.
- **Title Management**: Tests for creating, reading, updating, and deleting titles.

## Configuration

- **`jest.config.js`**: Configuration file for Jest.
- **`babel.config.js`**: Babel configuration to support ES6+ and JSX syntax.

## Known Issues

- **MetaMask Compatibility**: MetaMask must be installed and enabled in the browser to use wallet-related features.
- **Mocking `window.ethereum` in tests**: Some tests require mocking `window.ethereum` to simulate MetaMask; ensure mocks are correctly configured.

## Contributing

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is open-source by Dalibor and available under the [MIT License](LICENSE).
