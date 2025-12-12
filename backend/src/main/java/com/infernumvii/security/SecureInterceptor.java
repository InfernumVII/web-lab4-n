package com.infernumvii.security;

import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import java.io.Serializable;

@Interceptor
@Secure
public class SecureInterceptor implements Serializable {
    private static final long serialVersionUID = 1L;

    @AroundInvoke
    public Object secureMethod(InvocationContext ctx) throws Exception {
        return ctx.proceed();
    }
}
