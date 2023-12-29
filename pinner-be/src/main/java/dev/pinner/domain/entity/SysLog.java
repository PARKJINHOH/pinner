package dev.pinner.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "SYS_LOG")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SysLog extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Comment("Action Type")
    private String actionType; // "CREATE", "READ", "UPDATE", "DELETE"

    @Comment("실행된 패키지")
    private String packagePath;

    @Comment("실행된 메소드")
    private String method; // 수행된 쿼리

    @Comment("ip")
    private String ip;

    @Builder
    public SysLog(String actionType, String packagePath, String method, String ip) {
        this.actionType = actionType;
        this.packagePath = packagePath;
        this.method = method;
        this.ip = ip;
    }
}
