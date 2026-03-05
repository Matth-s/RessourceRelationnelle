using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RessourceRelationnelle.API.Migrations
{
    /// <inheritdoc />
    public partial class UserUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_DemographicsZone_DemographicZoneId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "DemographicZoneId",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_DemographicsZone_DemographicZoneId",
                table: "AspNetUsers",
                column: "DemographicZoneId",
                principalTable: "DemographicsZone",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_DemographicsZone_DemographicZoneId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "DemographicZoneId",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_DemographicsZone_DemographicZoneId",
                table: "AspNetUsers",
                column: "DemographicZoneId",
                principalTable: "DemographicsZone",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
