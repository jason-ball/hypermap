package hypermap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@ConfigurationPropertiesScan({ "hypermap" })
public class HypermapServerApplication extends SpringBootServletInitializer implements CommandLineRunner {
	private static PurpleAirExecutor purpleAirExecutor;

	public static void main(String[] args) {
		SpringApplication.run(HypermapServerApplication.class, args);
	}

	@Autowired
	public void setPurpleAirExecutor(PurpleAirExecutor p) {
		purpleAirExecutor = p;
	}

	@Override
	public void run(String... args) throws Exception {
		purpleAirExecutor.scheduleUpdates();
	}
}
