const axios = require("axios");
const {
  getTitles,
  addTitle,
  deleteTitle,
} = require("../services/titleService");

jest.mock("axios");

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("API functions", () => {
  const API_URL = process.env.REACT_APP_API_URL;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "testToken"); // Set a mock token before each test
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("getTitles", () => {
    it("should fetch titles successfully when a valid token is present", async () => {
      const userId = "123";
      const mockData = [{ id: 1, title: "Test Title" }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const response = await getTitles(userId);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/title`, {
        headers: { Authorization: "testToken" },
        params: { userId },
      });
    });

    it("should return an error when token is missing", async () => {
      localStorage.clear(); // Remove token
      const response = await getTitles("123");
      expect(response.success).toBe(false);
      expect(response.message).toBe("Token is missing or invalid");
    });

    it("should handle errors from the API", async () => {
      const userId = "123";
      axios.get.mockRejectedValueOnce({
        response: { data: { message: "Error fetching titles" } },
      });

      const response = await getTitles(userId);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Error fetching titles");
    });
  });

  describe("addTitle", () => {
    it("should add a title successfully when a valid token is present", async () => {
      const title = "New Title";
      const mockData = { id: 1, title: "New Title" };
      axios.post.mockResolvedValueOnce({ data: mockData });

      const response = await addTitle(title);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockData);
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/title`,
        { title: title },
        {
          headers: {
            Authorization: "testToken",
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should return an error when token is missing", async () => {
      localStorage.clear(); // Remove token
      const response = await addTitle("New Title");
      expect(response.success).toBe(false);
      expect(response.message).toBe("Token is missing or invalid");
    });

    it("should handle errors from the API", async () => {
      const title = "New Title";
      axios.post.mockRejectedValueOnce({
        response: { data: { message: "Error adding title" } },
      });

      const response = await addTitle(title);
      expect(response.success).toBe(false);
      expect(response.message).toBe("Error adding title");
    });
  });
});
