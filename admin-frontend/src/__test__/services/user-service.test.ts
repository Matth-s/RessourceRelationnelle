import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/lib/axios-client";
import type { createUserSchemaType } from "@/features/user/schemas/create-user-schema";
import { createUserApi } from "@/features/user/api/create-user-api";
import { USER_ROLE } from "@/types/user-type";
import { getUsersApi } from "@/features/user/api/get-users-api";
import type { updateUserType } from "@/features/user/schemas/update-user-schema";
import { updateUserApi } from "@/features/user/api/update-user-api";
import { deleteUserApi } from "@/features/user/api/delete-user-api";
import { getCurrentUserApi } from "@/features/user/api/get-current-user-api";
import type { ICurrentUserResponse } from "@/features/user/schemas/current-user-schema";

vi.mock("@/lib/axios-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Tests du service Utilisateurs (SuperAdmin)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserApi", () => {
    it("doit envoyer les données de création avec succès", async () => {
      const mockUserPayload: createUserSchemaType = {
        email: "test@cesizen.fr",
        username: "NewUser",
        password: "Password123!",
        confirmPassword: "Password123!",
        role: [USER_ROLE.USER],
      };

      vi.mocked(api.post).mockResolvedValue({ data: { id: "new-uuid" } });

      const result = await createUserApi(mockUserPayload);

      expect(api.post).toHaveBeenCalledWith("/superadmin", mockUserPayload);
      expect(result.id).toBe("new-uuid");
    });
  });

  describe("getUsersApi", () => {
    it("doit récupérer la liste des utilisateurs et transformer les dates via coerce", async () => {
      const rawData = [
        {
          id: "1",
          username: "Admin",
          email: "admin@test.fr",
          createdAt: "2024-01-01T10:00:00Z",
          isActive: true,
          emailVerified: true,
          role: [USER_ROLE.ADMIN],
        },
      ];

      vi.mocked(api.get).mockResolvedValue({ data: rawData });

      const result = await getUsersApi();

      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].username).toBe("Admin");
    });

    it("doit lever une erreur si l'API renvoie un role invalide", async () => {
      const invalidData = [{ id: "1", role: ["HACKER"] }];
      vi.mocked(api.get).mockResolvedValue({ data: invalidData });

      await expect(getUsersApi()).rejects.toThrow();
    });
  });

  describe("updateUserApi", () => {
    it("doit envoyer les modifications correctement typées", async () => {
      const userId = "user-789";
      const updatePayload: updateUserType = {
        username: "UpdatedName",
        email: "updated@test.fr",
        isActive: false,
        emailVerified: true,
        role: [USER_ROLE.ADMIN, USER_ROLE.USER],
      };

      vi.mocked(api.put).mockResolvedValue({ data: { success: true } });

      await updateUserApi({ formData: updatePayload, userId });

      expect(api.put).toHaveBeenCalledWith(
        `/superadmin/users/${userId}`,
        updatePayload,
      );
    });
  });

  describe("deleteUserApi", () => {
    it("doit appeler la route de suppression avec le bon ID", async () => {
      const userId = "target-id";
      vi.mocked(api.delete).mockResolvedValue({});

      await deleteUserApi(userId);

      expect(api.delete).toHaveBeenCalledWith(`/superadmin/users/${userId}`);
    });
  });

  describe("getCurrentUserApi", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    const mockUser: ICurrentUserResponse = {
      id: "user-123",
      username: "JohnDoe",
      role: [USER_ROLE.USER],
      token: "token",
    };

    it("should fetch and validate the current user", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUser });

      const result = await getCurrentUserApi();

      expect(api.get).toHaveBeenCalledWith("/user/current");
      expect(result.id).toBe("user-123");
      expect(result.username).toBe("JohnDoe");
    });

    it("should throw an error if the user schema is invalid", async () => {
      const invalidUser = { id: "123", roles: "NOT_AN_ARRAY" };
      vi.mocked(api.get).mockResolvedValue({ data: invalidUser });

      await expect(getCurrentUserApi()).rejects.toThrow();
    });
  });
});
