using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HandimanApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamManagementAndRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AccountId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // Add a temporary integer column for Role conversion
            migrationBuilder.AddColumn<int>(
                name: "RoleTemp",
                table: "TeamMembers",
                type: "integer",
                nullable: true);

            // Migrate data from old Role (string) to RoleTemp (int)
            migrationBuilder.Sql(@"
                UPDATE ""TeamMembers""
                SET ""RoleTemp"" = CASE
                    WHEN ""Role"" = 'admin' OR ""Role"" = 'Admin' THEN 1
                    WHEN ""Role"" = 'manager' OR ""Role"" = 'Manager' THEN 2
                    WHEN ""Role"" = 'employee' OR ""Role"" = 'Employee' THEN 3
                    ELSE 3
                END
            ");

            // Drop the old Role column
            migrationBuilder.DropColumn(
                name: "Role",
                table: "TeamMembers");

            // Rename RoleTemp to Role
            migrationBuilder.RenameColumn(
                name: "RoleTemp",
                table: "TeamMembers",
                newName: "Role");

            // Make Role non-nullable
            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "TeamMembers",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "TeamMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "TeamMembers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteAcceptedAt",
                table: "TeamMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteSentAt",
                table: "TeamMembers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "InviteToken",
                table: "TeamMembers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsInviteAccepted",
                table: "TeamMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "InviteAcceptedAt",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "InviteSentAt",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "InviteToken",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "IsInviteAccepted",
                table: "TeamMembers");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "TeamMembers",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
