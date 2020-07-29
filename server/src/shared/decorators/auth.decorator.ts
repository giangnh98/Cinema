import { UserRole } from "../../user/models/user-role.enum";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

export function Auth(...roles: UserRole[]) {
   return applyDecorators(
      SetMetadata("roles", roles),
      UseGuards(AuthGuard("jwt"), RolesGuard),
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: "Unauthorized" })
   );
}