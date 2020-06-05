
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MemberEditResolver implements Resolve< User > {

    constructor(private userService: UserService,
                private authService: AuthService,
                private router: Router,
                private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Error retrieving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }

}
