using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RessourceRelationnelle.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveShadowProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LikeModel_Resources_ResourceModelId",
                table: "LikeModel");

            migrationBuilder.DropIndex(
                name: "IX_LikeModel_ResourceModelId",
                table: "LikeModel");

            migrationBuilder.DropColumn(
                name: "ResourceModelId",
                table: "LikeModel");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResourceModelId",
                table: "LikeModel",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LikeModel_ResourceModelId",
                table: "LikeModel",
                column: "ResourceModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_LikeModel_Resources_ResourceModelId",
                table: "LikeModel",
                column: "ResourceModelId",
                principalTable: "Resources",
                principalColumn: "Id");
        }
    }
}
