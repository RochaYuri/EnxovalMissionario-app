import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InfoBox({ Text, Number, Icon, Background }) {
  return (
    <div className={`info-box ${Background}`}>
      <span className="info-box-icon">
        <FontAwesomeIcon icon={Icon} />
      </span>
      <div className="info-box-content">
        <span className="info-box-text fw-bold">{Text}</span>
        <span className="info-box-number fw-bold">
          {Number === 0 ? (
            <FontAwesomeIcon icon={faSyncAlt} spin />
          ) : (
            <div>{Number}</div>
          )}
        </span>
      </div>
    </div>
  );
}
