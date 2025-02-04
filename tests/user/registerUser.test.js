import request from 'supertest';
import app, { server } from '../../index.js';
import User from '../../models/user.js';
import mongoose from 'mongoose';

// Mock the User model
jest.mock('../../models/user.js');

describe("User Registration", () => {
    
    afterAll(async () => {
        await mongoose.disconnect(); // Close DB connection
        await server.close(); // Stop server
    });

    test("should register a user successfully", async () => {

        // Mock User.prototype.save to simulate successful user creation
        User.prototype.save.mockResolvedValueOnce({
            _id: "12345",
            name: "John Doe",
            email: "john@example.com",
        });

        const response = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            });

        console.log(response.body); // Log the response for debugging

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User Registered Successfully");
    });

    test("should handle registration error", async () => {
        // Mock User.findOne to return null (no duplicate user)
        User.findOne.mockResolvedValueOnce(null);

        // Mock User.prototype.save to simulate a database error
        User.prototype.save.mockRejectedValueOnce(new Error("Database error"));

        const response = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            });

        console.log(response.body); // Log the response for debugging

        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});