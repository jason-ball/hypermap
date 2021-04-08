package hypermap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class TheSandboxApplication extends SpringBootServletInitializer {
	private static PurpleAirExecutor purpleAirExecutor;

	public static void main(String[] args) {
		SpringApplication.run(TheSandboxApplication.class, args);
		purpleAirExecutor.scheduleUpdates();
	}

	@Autowired
	public void setPurpleAirExecutor(PurpleAirExecutor p) {
		purpleAirExecutor = p;
	}
}
