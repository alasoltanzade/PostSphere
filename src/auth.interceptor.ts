import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token"); // فرض کنید توکن احراز هویت در localStorage ذخیره شده است

    if (token) {
      // اگر توکن موجود باشد، آن را به هدر درخواست اضافه می‌کنیم
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(clonedRequest);
    }

    return next.handle(request); // در غیر اینصورت، درخواست بدون تغییر ارسال می‌شود
  }
}
