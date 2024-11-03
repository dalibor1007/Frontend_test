import axios from "axios";
import {
  login,
  register,
  logout,
  getCurrentUser,
} from "../services/authService";

jest.mock("axios");

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Auth Service", () => {
  const API_URL = process.env.REACT_APP_API_URL;

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should log in successfully and store token in localStorage", async () => {
      const mockData = { token: "testToken" };
      axios.post.mockResolvedValueOnce({ data: mockData });

      const response = await login("test@example.com", "password123");
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockData);
      expect(localStorage.getItem("token")).toBe("testToken");
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return an error message on failed login", async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { message: "Invalid credentials" } },
      });

      const response = await login("test@example.com", "wrongpassword");
      expect(response.success).toBe(false);
      expect(response.message).toBe("Invalid credentials");
      expect(localStorage.getItem("token")).toBe(null);
    });

    it("should return default error message if error response does not contain a message", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network error"));

      const response = await login("test@example.com", "password123");
      expect(response.success).toBe(false);
      expect(response.message).toBe("Login failed");
    });
  });

  describe("register", () => {
    it("should register successfully and return success message", async () => {
      axios.post.mockResolvedValueOnce({});

      const response = await register(
        "testuser",
        "test@example.com",
        "password123"
      );
      expect(response.success).toBe(true);
      expect(response.message).toBe("Registration successful");
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/register`, {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return an error message on failed registration", async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { message: "Email already exists" } },
      });

      const response = await register(
        "testuser",
        "test@example.com",
        "password123"
      );
      expect(response.success).toBe(false);
      expect(response.message).toBe("Email already exists");
    });

    it("should return default error message if error response does not contain a message", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network error"));

      const response = await register(
        "testuser",
        "test@example.com",
        "password123"
      );
      expect(response.success).toBe(false);
      expect(response.message).toBe("Registration failed");
    });
  });

  describe("logout", () => {
    it("should remove token from localStorage", () => {
      localStorage.setItem("token", "testToken");
      logout();
      expect(localStorage.getItem("token")).toBe(null);
    });
  });

  describe("getCurrentUser", () => {
    it("should return token if it exists in localStorage", () => {
      localStorage.setItem("token", "testToken");
      const token = getCurrentUser();
      expect(token).toBe("testToken");
    });

    it("should return null if no token is in localStorage", () => {
      const token = getCurrentUser();
      expect(token).toBe(null);
    });
  });
});
