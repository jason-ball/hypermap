package hypermap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import security.APIKeyFilter;

@EnableWebSecurity
@Component
@ConfigurationProperties(prefix = "hypermap.security")
@Order(1)
public class APISecurityConfig extends WebSecurityConfigurerAdapter {
    private static final Logger LOG = LoggerFactory.getLogger(APISecurityConfig.class);

    // @Value("${hypermap.security.authHeader}")
    private String authHeader;

    // @Value("${hypermap.security.apiKey}")
    private String apiKey;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        APIKeyFilter apiKeyFilter = new APIKeyFilter(authHeader);
        apiKeyFilter.setAuthenticationManager(this::verifyAPIKey);

        httpSecurity
                .csrf().disable()
                .httpBasic().disable()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                .antMatcher("/api/**")
                    .addFilter(apiKeyFilter)
                    .authorizeRequests()
                        .antMatchers(HttpMethod.GET)
                            .permitAll()
                        .anyRequest()
                            .authenticated();
    }

    private Authentication verifyAPIKey(Authentication authentication) {
        String token = (String) authentication.getPrincipal();
        if (!apiKey.equals(token)) {
            throw new BadCredentialsException("Auth token invalid or missing.");
        }
        authentication.setAuthenticated(true);
        return authentication;
    }

    public void setAuthHeader(String authHeader) {
        this.authHeader = authHeader;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
