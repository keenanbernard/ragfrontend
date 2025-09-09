import React from 'react';
import './SidebarItem.css';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const SidebarItem = ({ title, isActive, onClick }) => {
    return (
        <OverlayTrigger
            trigger={["hover", "click"]}
            rootClose key={'right'}
            placement={'right'}
            overlay={
                <Tooltip id={`tooltip-right`}>
                    {title}
                </Tooltip>
            }
        >
        <div
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {title}
        </div>
            </OverlayTrigger>
    );
};

export default SidebarItem;
