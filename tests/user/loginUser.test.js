import request from 'supertest';
import app, { server } from '../../index.js';
import User from '../../models/user.js';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock the User model
jest.mock('../../models/user.js');
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User login", () => {
    
    afterAll(async () => {
        await mongoose.disconnect(); // Close DB connection
        await server.close(); // Stop server
    });

    test("should login a user successfully", async () => {
        User.findOne.mockResolvedValueOnce({
            _id: "12345",
            name: "John Doe",
            email: "john@example.com",
        });

        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValue("mockToken");

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com",
                password: "password123",
            });

        console.log(response.body); // Log the response for debugging

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Logged in succesfully!");
        expect(response.body).toHaveProperty("token", "mockToken");
    });

    it("should fail login with incorrect password", async () => {
        const mockUser = { 
            _id: "12345", 
            email: "john@example.com", 
            password: "hashedPassword"
        };

        User.findOne.mockResolvedValueOnce(mockUser);
        bcrypt.compare.mockResolvedValueOnce(false);

        const response = await request(app).post("/api/users/login").send({
            email: "john@example.com",
            password: "wrongpassword",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Incorrect Password!");
    });

    it("should fail login if user not found", async () => {
        User.findOne.mockResolvedValueOnce(null);

        const response = await request(app).post("/api/users/login").send({
            email: "john@example.com",
            password: "password123",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Unable to login, user not found!");
    });
});