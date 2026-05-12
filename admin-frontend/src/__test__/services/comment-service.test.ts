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

describe("Comments api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  describe("createCommentApi", () => {
    it("doit créer un commentaire", async () => {
      mock.onPost("/commentary").reply(201);

      await expect(
        createCommentApi({
          content: "Test comment",
          resourceId: "1",
        }),
      ).resolves.toBeUndefined();
    });

    it("sdoit jeter une erreur lors de la creation d un commentaire", async () => {
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
    it("doit supprimer un commentaire", async () => {
      mock.onDelete("/SuperAdmin/comments/1").reply(204);

      await expect(deleteCommentApi("1")).resolves.toBeUndefined();
    });

    it("doit echouer lors de la suppression d un commentaire", async () => {
      mock.onDelete("/SuperAdmin/comments/1").reply(404);

      await expect(deleteCommentApi("1")).rejects.toThrow();
    });
  });

  describe("getCommentsApi", () => {
    it("doit retourner des commentaires valide", async () => {
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

    it("doit jeter une erreur si le schema n est pas valide", async () => {
      const invalidResponse = [
        {
          id: "1",
        },
      ];

      mock.onGet("/superadmin/comments").reply(200, invalidResponse);

      await expect(getCommentsApi()).rejects.toThrow();
    });

    it("l api doit jeter une erreur", async () => {
      mock.onGet("/superadmin/comments").reply(500);

      await expect(getCommentsApi()).rejects.toThrow();
    });
  });

  describe("updateCommentApi", () => {
    it("doit update un commentaire et retourne le commantaire update", async () => {
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

    it("doit jeter une erreur si le schema est invalide", async () => {
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

    it("doit retourner une erreur lors de l update", async () => {
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
    it("doit retourner seulement les commentaire valide", async () => {
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

    it("doit retourner un tableau il tout les commentaires sont éronnés", async () => {
      const invalidResponse = [
        {
          invalid: true,
        },
      ];

      mock.onGet("/commentary/resource/1").reply(200, invalidResponse);

      const result = await getCommentsByResourceId("1");

      expect(result).toEqual([]);
    });

    it("l api retourne une erreur", async () => {
      mock.onGet("/commentary/resource/1").reply(500);

      await expect(getCommentsByResourceId("1")).rejects.toThrow();
    });
  });
});
