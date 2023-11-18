import { AuthenticationError } from "@nestjs/apollo";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError("Could not authenticate with token");
    }

    return user;
  }
}
