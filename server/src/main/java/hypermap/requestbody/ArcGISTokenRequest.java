package hypermap.requestbody;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.Serializable;

@Data
public class ArcGISTokenRequest implements Serializable {
    @JsonProperty("client_id")
    private String clientID;

    @JsonProperty("client_secret")
    private String clientSecret;

    @JsonProperty("grant_type")
    private final String grantType = "client_credentials";

    @JsonProperty("expiration")
    private int expiration = 20160;

    public MultiValueMap<String, String> toMap() {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

        map.add("client_id", this.clientID);
        map.add("client_secret", this.clientSecret);
        map.add("grant_type", this.grantType);
        map.add("expiration", String.valueOf(this.expiration));

        return map;
    }
}
