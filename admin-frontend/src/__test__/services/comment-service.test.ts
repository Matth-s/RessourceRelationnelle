import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-client";
import { v4 as uuidv4 } from "uuid";
import { createCommentApi } from "@/features/comments/api/create-comment-api";
import { deleteCommentApi } from "@/features/comments/api/delete-comment-api";
import { getCommentsApi } from "@/features/comments/api/get-comments-api";
import { updateCommentApi } from "@/features/comments/api/update-comment-api";
import { getCommentsByResourceId } from "@/features/comments/api/get-comment-by-resource-id-api";
import { PUBLICATION_RESOURCE_KEY } from "@/types/resource-type";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

describe("Comments APIs", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  describe("createCommentApi", () => {
    it("should create a comment successfully", async () => {
      mock.onPost("/commentary").reply(201);

      await expect(
        createCommentApi({
          content: "Test comment",
          resourceId: "1",
        }),
      ).resolves.toBeUndefined();
    });

    it("should throw on create error", async () => {
      mock.onPost("/commentary").reply(500);

      await expect(
        createCommentApi({
          content: "Test comment",
          resourceId: "1",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCommentApi", () => {
    it("should delete a comment successfully", async () => {
      mock.onDelete("/SuperAdmin/comments/1").reply(204);

      await expect(deleteCommentApi("1")).resolves.toBeUndefined();
    });

    it("should throw on delete error", async () => {
      mock.onDelete("/SuperAdmin/comments/1").reply(404);

      await expect(deleteCommentApi("1")).rejects.toThrow();
    });
  });

  describe("getCommentsApi", () => {
    it("should return validated comments", async () => {
      const mockResponse = [
        {
          id: "1",
          content: "Comment 1",
          moderationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
          createdAt: new Date(),
          user: {
            id: uuidv4(),
            username: "name",
          },
          resource: {
            id: uuidv4(),
            title: "test",
          },
        },
      ];

      mock.onGet("/superadmin/comments").reply(200, mockResponse);

      const result = await getCommentsApi();

      expect(result).toEqual(mockResponse);
    });

    it("should throw if schema validation fails", async () => {
      const invalidResponse = [
        {
          id: "1",
        },
      ];

      mock.onGet("/superadmin/comments").reply(200, invalidResponse);

      await expect(getCommentsApi()).rejects.toThrow();
    });

    it("should throw on api error", async () => {
      mock.onGet("/superadmin/comments").reply(500);

      await expect(getCommentsApi()).rejects.toThrow();
    });
  });

  describe("updateCommentApi", () => {
    it("should update and return validated comment", async () => {
      mock.onPut("/superadmin/comments/1").reply(200, {
        message: "Comment updated",
      });

      const result = await updateCommentApi({
        commentId: "1",
        moderationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
      });

      expect(result).toEqual({
        message: "Comment updated",
      });
    });

    it("should throw if response schema is invalid", async () => {
      const invalidResponse = {
        commentId: "1",
      };

      mock.onPut("/superadmin/comments/1").reply(200, invalidResponse);

      await expect(
        updateCommentApi({
          commentId: "1",
          moderationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
        }),
      ).rejects.toThrow();
    });

    it("should throw on update error", async () => {
      mock.onPut("/superadmin/comments/1").reply(400);

      await expect(
        updateCommentApi({
          commentId: "1",
          moderationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
        }),
      ).rejects.toThrow();
    });
  });

  describe("getCommentsByResourceId", () => {
    it("should return only valid comments", async () => {
      const mockResponse = [
        {
          id: "1",
          content: "Valid comment",
        },
        {
          invalid: true,
        },
      ];

      mock.onGet("/commentary/resource/1").reply(200, mockResponse);

      const result = await getCommentsByResourceId("1");

      expect(result).toEqual([]);
    });

    it("should return empty array if all comments are invalid", async () => {
      const invalidResponse = [
        {
          invalid: true,
        },
      ];

      mock.onGet("/commentary/resource/1").reply(200, invalidResponse);

      const result = await getCommentsByResourceId("1");

      expect(result).toEqual([]);
    });

    it("should throw on api error", async () => {
      mock.onGet("/commentary/resource/1").reply(500);

      await expect(getCommentsByResourceId("1")).rejects.toThrow();
    });
  });
});
