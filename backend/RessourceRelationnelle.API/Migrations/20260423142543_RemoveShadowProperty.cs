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
                name: "FK_Like_Resources_ResourceModelId",
                table: "Like");

            migrationBuilder.DropIndex(
                name: "IX_Like_ResourceModelId",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "ResourceModelId",
                table: "Like");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResourceModelId",
                table: "Like",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Like_ResourceModelId",
                table: "Like",
                column: "ResourceModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Like_Resources_ResourceModelId",
                table: "Like",
                column: "ResourceModelId",
                principalTable: "Resources",
                principalColumn: "Id");
        }
    }
}
