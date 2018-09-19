import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'PollWebPartStrings';
import Poll from './components/Poll';
import { IPollProps } from './components/IPollProps';

export interface IPollWebPartProps {
  pollTitle: string;
  pollDataCollection: any[];
  pollDescription: string;
  content: string;
  pollResultType: string;
}

export default class PollWebPart extends BaseClientSideWebPart<IPollWebPartProps> {

  private _chartTypeOptions: IPropertyPaneDropdownOption[] = [
    { key: 'bar', text: 'Bar' },
    { key: 'horizontalbar', text: 'Horizontal Bar' },
    { key: 'doughnut', text: 'Doughnut' },
    { key: 'line', text: 'Line' },
    { key: 'pie', text: 'Pie' }
  ];


  private _onConfigure() {
    // Context of the web part
    this.context.propertyPane.open();
  }

  protected updateContentHandler = (value : string) => {
    this.properties.content = value;
  }

  public render(): void {
    const element: React.ReactElement<IPollProps> = React.createElement(
      Poll,
      {
        pollTitle: this.properties.pollTitle,
        pollDataCollection: this.properties.pollDataCollection,
        pollDescription: this.properties.pollDescription,
        pollResultType: this.properties.pollResultType,
        updateContent : this.updateContentHandler.bind(this),
        content :  this.properties.content,
        _onConfigure : this._onConfigure.bind(this)
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected handlePollTitle = (value: string): string => {
    if (value.trim().length > 0) {
      return '';
    }

    return "Poll Title is missing";
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Configure your Poll and get views on what people think!"
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Configure Your Poll Details",
              isCollapsed: false,
              groupFields: [
                PropertyPaneTextField('pollTitle', {
                  label: "Enter your Poll Title",
                  onGetErrorMessage : this.handlePollTitle.bind(this)
                }),
                PropertyPaneTextField("pollDescription", {
                  label: "Enter a Description for your Poll"
                }),
                PropertyFieldCollectionData('pollDataCollection', {
                  key: "pollDataCollection",
                  label: "Create your Poll Options",
                  manageBtnLabel: "Manage Options",
                  panelHeader: "Poll Option Collection panel",
                  value: this.properties.pollDataCollection,
                  fields: [{
                    id: "option",
                    title: "Poll Option",
                    type: CustomCollectionFieldType.string
                  }],
                  disabled: false
                })
              ]
            },
            {
              isCollapsed: true,
              groupName: "Configure your Poll Results",
              groupFields: [
                PropertyPaneDropdown('pollResultType', {
                  label: "How do you want your Poll results to be displayed",
                  options: this._chartTypeOptions
                }),
                PropertyPaneTextField('content', {
                  disabled: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
