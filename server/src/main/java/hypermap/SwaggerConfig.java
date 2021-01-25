package hypermap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket postsApi() {
        return new Docket(DocumentationType.SWAGGER_2).groupName("Hypermap").select()
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                .paths(PathSelectors.ant("/api/**"))
                .build();
    }


//    private Predicate<String> postPaths() {
//        return or(regex("/api.*"), regex("/api/hypermap.controller.*"));
//    }

    private ApiInfo apiInfo() {
        // Will need to modify this before project finish
        return new ApiInfoBuilder().title("Hypermap API")
                .description("Hypermap API Reference for Developers")
                .termsOfServiceUrl("https://www.vcu.edu/")
                .license("Evan Scott, Naomi Steele, Jason Ball, and Christian Manu")
                .licenseUrl("scottem3@vcu.edu").version("0.0").build();
    }

}
