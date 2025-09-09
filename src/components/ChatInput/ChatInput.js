import React from 'react'
import './ChatInput.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faHourglass} from "@fortawesome/free-solid-svg-icons";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const ChatInput = (props) => {
    const placeholderText = 'The Law of Belize';

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // prevent newline
            e.target.form.requestSubmit(); // submit form
        }
    };

    return (
        <form className="chat-input-container" onSubmit={props.handlesubmit}>
            <div className="textarea-wrapper">
                <textarea
                    name="query"
                    className="chat-input"
                    placeholder={`Try me! Ask anything on ${placeholderText}`}
                    disabled={props.loading}
                    onKeyDown={handleKeyDown}
                    rows="2"
                />

                <OverlayTrigger
                    trigger={["hover", "click"]}
                    rootClose key={'right'}
                    placement={'right'}
                    overlay={
                        <Tooltip id={`tooltip-right`}>
                            Submit
                        </Tooltip>
                    }
                >
                    <button type="submit" className={`chat-submit ${props.loading}`} disabled={props.loading}>
                      <span key={props.loading ? 'loading' : 'ready'} className="transition">
                          <FontAwesomeIcon icon={props.loading ? faHourglass : faArrowUp} />
                      </span>
                    </button>
                </OverlayTrigger>
            </div>
        </form>
    );
}

export default ChatInput;