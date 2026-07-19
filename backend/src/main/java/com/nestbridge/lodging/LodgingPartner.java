package com.nestbridge.lodging;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "lodging_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LodgingPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "partner_id")
    private UUID partnerId;

    private String name;
    private String city;
    private String category;
    private String address;
    private String phone;
    private String email;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "booking_url")
    private String bookingUrl;

    @Column(name = "price_from")
    private BigDecimal priceFrom;

    private String currency;
    private String description;

    @Column(name = "is_active")
    private boolean active;
}
