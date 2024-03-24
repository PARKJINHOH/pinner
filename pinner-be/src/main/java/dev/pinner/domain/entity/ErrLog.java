package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "ERR_LOG")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrLog extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("실행된 패키지")
    private String packagePath;

    @Comment("실행된 메소드")
    private String method;

    @Comment("실행된 메소드")
    private String err_msg;

    @Comment("ip")
    private String ip;

    @Builder
    public ErrLog(String packagePath, String method, String err_msg, String ip) {
        this.packagePath = packagePath;
        this.method = method;
        this.err_msg = err_msg;
        this.ip = ip;
    }
}
