import { VisibilityProperty } from "csstype";
import * as React from "react";
import { Component, CSSProperties } from "react";
import { MangaInfo } from "../MangaInfo";

interface InfoContainerState {
    description: string;
    image: string;
    position: { left: string; top: string, };
    visibility: string;
}

export class InfoContainer extends Component {

    public state: InfoContainerState = {
        description: "",
        image: "",
        position: {
            left: "0px",
            top: "0px",
        },
        visibility: "hidden",
    };

    private currentDataUrl: string;

    public constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className="globalPopUp" id="globalPopUp" style={this.styling()}>
                <img src={this.state.image} className="manga-image"/>
            </div>);
    }

    public changeInfo(data: MangaInfo, sourcePath: string): void {
        this.currentDataUrl = sourcePath;

        this.setState({
            image: data === null ? "" : data.imagePath,
        });
    }

    public updatePosition(event: MouseEvent) {
        this.setState({
            position: {
                left: `${event.clientX + 10}px`,
                top: `${event.clientY + 10}px`,
            },
        });
    }

    public hide() {
        this.setState({
            visibility: "hidden",
        });
    }

    public show() {
        this.setState({
            visibility: "visible",
        });
    }

    public alreadyGoodData(element: HTMLLinkElement) {
        return element.href === this.currentDataUrl;
    }

    private styling(): CSSProperties {
        return {
            left: this.state.position.left,
            top: this.state.position.top,
            visibility: this.state.visibility as VisibilityProperty,
        };
    }
}
