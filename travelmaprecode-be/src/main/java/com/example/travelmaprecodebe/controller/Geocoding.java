package com.example.travelmaprecodebe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;

@Slf4j
@RestController
@RequestMapping("/api/v1/geocoding")
public class Geocoding {
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String googleApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Geocoding(@Value("${google-api-key}") String googleApiKey) throws MalformedURLException {
        this.googleApiKey = googleApiKey;
    }

    /**
     * 주어진 위도와 경도를 기반으로 국가와 시로 구성된 문자열 반환
     *
     * @param lat     latitude
     * @param lng     longitude
     * @param reverse must be {@code true}
     * @return formatted string in Korean. for example, {@code 포르투갈 포르토}
     */
    @GetMapping
    public ResponseEntity<?> geocoding(
            @RequestParam("lat") @NotNull double lat,
            @RequestParam("lng") @NotNull double lng,
            @RequestParam("reverse") boolean reverse
    ) {
        try {
            if (!reverse) {
                return ResponseEntity.badRequest().body("this api only accept reverse geocoding");
            }

            return ResponseEntity.ok(reverseGeocoding(lat, lng));
        } catch (Exception e) {
            log.error("something wrong: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Reverse geocoding API 웹훅.
     *
     * <pre>
     * {
     *     "plus_code": {
     *         "compound_code": "5926+5XW 포르투갈 포르토",
     *         "global_code": "8CHH5926+5XW"
     *     },
     *     "results": [
     *         {
     *             "address_components": [
     *                 {
     *                     "long_name": "포르토",
     *                     "short_name": "포르토",
     *                     "types": [
     *                         "locality",
     *                         "political"
     *                     ]
     *                 },
     *                 {
     *                     "long_name": "포르토",
     *                     "short_name": "포르토",
     *                     "types": [
     *                         "administrative_area_level_1",
     *                         "political"
     *                     ]
     *                 },
     *                 {
     *                     "long_name": "포르투갈",
     *                     "short_name": "PT",
     *                     "types": [
     *                         "country",
     *                         "political"
     *                     ]
     *                 }
     *             ],
     *             "formatted_address": "포르투갈 포르토",
     *             "geometry": {
     *                 "bounds": {
     *                     "northeast": {
     *                         "lat": 41.1859353,
     *                         "lng": -8.5526134
     *                     },
     *                     "southwest": {
     *                         "lat": 41.1383506,
     *                         "lng": -8.6912939
     *                     }
     *                 },
     *                 "location": {
     *                     "lat": 41.1579438,
     *                     "lng": -8.629105299999999
     *                 },
     *                 "location_type": "APPROXIMATE",
     *                 "viewport": {
     *                     "northeast": {
     *                         "lat": 41.1859353,
     *                         "lng": -8.5526134
     *                     },
     *                     "southwest": {
     *                         "lat": 41.1383506,
     *                         "lng": -8.6912939
     *                     }
     *                 }
     *             },
     *             "place_id": "ChIJwVPhxKtlJA0RvBSxQFbZSKY",
     *             "types": [
     *                 "locality",
     *                 "political"
     *             ]
     *         }
     *     ],
     *     "status": "OK"
     * }
     * </pre>
     *
     * @param lat
     * @param lng
     * @return
     */
    private String reverseGeocoding(double lat, double lng) throws IOException, InterruptedException {

        URI uri = URI.create(String.format("https://maps.googleapis.com/maps/api/geocode/json?language=ko&result_type=locality&key=%s&latlng=%f,%f", googleApiKey, lat, lng));

        HttpRequest request = HttpRequest.newBuilder(uri).build();
        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        GeocodingResponse value = objectMapper.readValue(response.body(), GeocodingResponse.class);

        log.debug("리버스 지오코딩 응답: {}", value);

        return Arrays.stream(value.results).findFirst().get().formattedAddress;
    }

    /**
     * Response DTO of google reverse geocoding.
     */
    @Data
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    private static class GeocodingResponse {

        private PlusCode plusCode;
        private Result[] results;
        private String status;

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class PlusCode {
            private String compoundCode;
            private String globalCode;
        }

        @Data
        @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
        public static class Result {
            private AddressComponent[] addressComponents;
            private String formattedAddress;
            private Geometry geometry;
            private String placeID;
            private String[] types;

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class AddressComponent {
                private String longName;
                private String shortName;
                private String[] types;
            }

            @Data
            @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
            public static class Geometry {
                private Bounds bounds;
                private Location location;
                private String locationType;
                private Bounds viewport;

                @Data
                @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
                public static class Bounds {
                    private Location northeast;
                    private Location southwest;
                }

                @Data
                @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
                public static class Location {
                    private double lat;
                    private double lng;
                }
            }
        }
    }
}
