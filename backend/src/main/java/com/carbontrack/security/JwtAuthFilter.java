package com.carbontrack.security;

import com.carbontrack.service.PresenceService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Chạy 1 lần cho mỗi request: nếu có header "Authorization: Bearer <token>" hợp lệ
 * thì đánh dấu người dùng đã đăng nhập cùng role của họ.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final PresenceService presenceService;

    public JwtAuthFilter(JwtService jwtService, PresenceService presenceService) {
        this.jwtService = jwtService;
        this.presenceService = presenceService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtService.isValid(token)) {
                String userId = jwtService.extractUserId(token);
                String role = jwtService.extractRole(token);

                // Spring Security quy ước role phải có tiền tố "ROLE_"
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                // principal = userId -> controller lấy bằng @AuthenticationPrincipal
                var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                presenceService.touch(userId); // ghi nhận đang online (tối đa 1 lần/phút)
            }
        }

        filterChain.doFilter(request, response);
    }
}
