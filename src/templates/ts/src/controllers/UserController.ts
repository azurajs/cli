import { Controller, Get, Post, Put, Delete, Body, Param, Res } from "azurajs/decorators";
import type { ResponseServer } from "azurajs/types";
import type { User, ApiResponse } from "../types/index";

@Controller("/api")
export class UserController {
  @Get("/users")
  getAllUsers(@Res() res: ResponseServer) {
    const users: User[] = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
      { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" },
    ];

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
    };

    res.json(response);
  }

  @Get("/users/:id")
  getUserById(@Param("id") id: string, @Res() res: ResponseServer) {
    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const user: User = {
      id: userId,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      role: "user",
    };

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    res.json(response);
  }

  @Post("/users")
  createUser(@Body() body: Partial<User>, @Res() res: ResponseServer) {
    if (!body.name || !body.email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    const newUser: User = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      role: body.role || "user",
    };

    const response: ApiResponse<User> = {
      success: true,
      message: "User created successfully",
      data: newUser,
    };

    res.status(201).json(response);
  }

  @Put("/users/:id")
  updateUser(@Param("id") id: string, @Body() body: Partial<User>, @Res() res: ResponseServer) {
    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const updatedUser: User = {
      id: userId,
      name: body.name || `User ${id}`,
      email: body.email || `user${id}@example.com`,
      role: body.role || "user",
    };

    const response: ApiResponse<User> = {
      success: true,
      message: `User ${id} updated successfully`,
      data: updatedUser,
    };

    res.json(response);
  }

  @Delete("/users/:id")
  deleteUser(@Param("id") id: string, @Res() res: ResponseServer) {
    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const response: ApiResponse = {
      success: true,
      message: `User ${id} deleted successfully`,
    };

    res.json(response);
  }
}
