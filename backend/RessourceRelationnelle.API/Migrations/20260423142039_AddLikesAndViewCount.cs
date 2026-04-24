using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RessourceRelationnelle.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLikesAndViewCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LikeModel",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ResourceId = table.Column<string>(type: "text", nullable: false),
                    ResourceModelId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikeModel", x => new { x.UserId, x.ResourceId });
                    table.ForeignKey(
                        name: "FK_LikeModel_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LikeModel_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "Resources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LikeModel_Resources_ResourceModelId",
                        column: x => x.ResourceModelId,
                        principalTable: "Resources",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_LikeModel_ResourceId",
                table: "LikeModel",
                column: "ResourceId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeModel_ResourceModelId",
                table: "LikeModel",
                column: "ResourceModelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LikeModel");
        }
    }
}
