import request from 'supertest';
import app, { server } from '../../index.js';
import User from '../../models/user.js';
import mongoose from 'mongoose';
import Task from '../../models/task.js';
import auth from '../../middleware/authentication.js';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkxMjM2YjBkMWU1YzUxNGVkYmU3NmMiLCJpYXQiOjE3Mzc1OTc2MzB9.KTItER1OmsyltiJ3I5onpM00hOUZr2dxGp7brX5PqAI";

jest.mock("../../models/task.js");

jest.mock("../../middleware/authentication.js", () => (req, res, next) => {
    req.user = { _id: "123456" };
    req.token = token;
    next();
});

describe("Task Routes", () => {
    afterAll(async () => {
        await mongoose.disconnect();
        await server.close();
    });

    test("should create a task successfully", async () => {

        // Mock User.prototype.save to simulate successful user creation
        Task.prototype.save.mockResolvedValueOnce({
            _id: "task123",
            title: "Test task",
            description: "This is a test task",
            status: "pending"
        });

        const response = await request(app)
            .post("/api/tasks")
            .send({
                title: "Test task",
                description: "This is a test task",
                status: "pending",
            });

        console.log(response.body); // Log the response for debugging

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Task created Succesfully");
    });

    // test("should create a task successfully", async () => {
    //     Task.prototype.save.mockResolvedValueOnce(true);


    //         const response = await request(app)
    //         .post("/api/tasks")
    //         .set("Authorization", `Bearer ${token}`)
    //         .send({
    //             title: "Test Task",
    //             description: "This is a test task",
    //             status: "pending"
    //         });


    //     console.log(response.body); 

    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty("message", "Task created Succesfully");
    // });

    test("should fetch all tasks of a user", async () => {
        Task.find.mockResolvedValueOnce([{ _id: "task123", title: "Test Task" }]);

        const response = await request(app).get("/api/tasks").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Tasks Fetched Successfully");
    });

    test("should fetch a specific task by ID", async () => {
        Task.findOne.mockResolvedValueOnce({ _id: "task123", title: "Test Task" });

        const response = await request(app).get("/api/tasks/task123").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Task Fetched Successfully");
    });

    test("should return 404 if task not found", async () => {
        Task.findOne.mockResolvedValueOnce(null);

        const response = await request(app).get("/api/tasks/task999").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Task not found");
    });

    test("should update a task successfully", async () => {
        Task.findOne.mockResolvedValueOnce({ _id: "task123", title: "Old Task", save: jest.fn() });

        const response = await request(app).patch("/api/tasks/task123").set("Authorization", `Bearer ${token}`).send({
            description: "Updated Description",
            status: "done"
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Task Updated Successfully");
    });

    test("should return 404 if updating a non-existent task", async () => {
        Task.findOne.mockResolvedValueOnce(null);

        const response = await request(app).patch("/api/tasks/task999").set("Authorization", `Bearer ${token}`).send({
            description: "Updated Description"
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Task not found");
    });

    test("should delete a task successfully", async () => {
        Task.findOneAndDelete.mockResolvedValueOnce({ _id: "task123" });

        const response = await request(app).delete("/api/tasks/task123").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Task Deleted Successfully");
    });

    test("should return 404 if deleting a non-existent task", async () => {
        Task.findOneAndDelete.mockResolvedValueOnce(null);

        const response = await request(app).delete("/api/tasks/task999").set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Task not found");
    });
});
