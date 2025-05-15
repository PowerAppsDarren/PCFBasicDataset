import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

//
// IInputs and IOutputs 
// ...are interfaces that define the structure of data coming into and going 
// out of your component, based on what you defined in the Manifest.
//
export class PCFBasicDataset implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // This is a variable that will hold a reference to the main HTML element that 
    // Power Apps gives your component to draw itself in.
    private _container: HTMLDivElement;

    /** ===========================================================================================
     * 
     * Empty constructor.
     * 
     */
    constructor() {
        // Empty
    }

    /** ===========================================================================================
     * This function is called once when the component is loaded onto the Power App screen. 
     * It's where you do your initial setup, like creating the basic HTML structure of your component.
     * 
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * 
     * @param context 
     *              The entire property bag available to control via Context Object; 
     *              It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * 
     *              An incredibly important object. It gives you access to:
                        context.parameters: 
                            This is how you get the data passed from Power Apps, 
                            including your dataset (e.g., context.parameters.sampleDataSet).
                        context.mode: 
                            Information about the component's state (e.g., is it disabled?).
                        context.client: 
                            Information about the client (web, mobile).
                        context.utils: 
                            Utility functions (e.g., for formatting).
                        context.navigation: 
                            Functions for navigation (e.g., opening a record).
     * 
     * @param notifyOutputChanged 
     *              A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * 
                    A function you call if your component has output properties that have changed and Power Apps needs to know. 
                    Less common for simple dataset display components.
     * 
     * @param state 
     *              A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container 
     *              If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     * 
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        const messageElement = document.createElement("div");

        // Good practice to give elements IDs
        messageElement.id = "recordCountMessage"; 

        // Add some very basic inline styling (not best practice for larger components, but ok for intro)
        messageElement.style.padding = "10px";
        messageElement.style.fontSize = "16px";

        // Initial text
        messageElement.innerText = "Initializing..."; 

        // Add it to the component's main container
        this._container.appendChild(messageElement); 
    }

    /** ===========================================================================================
     * Called when any value in the property bag has changed. This includes field values, data-sets, 
     * global values such as container height and width, offline status, control metadata values 
     * such as label, visible, etc.
     * 
     * @param context 
     *              The entire property bag available to control via Context Object; 
     *              It contains values as set up by the customizer mapped to names 
     *              defined in the manifest, as well as utility functions
     * 
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // 'sampleDataSet' must match the name in ControlManifest.Input.xml
        const dataSet = context.parameters.sampleDataSet; 
        
        // Get the element we created in init
        const messageElement = this._container.querySelector("#recordCountMessage") as HTMLDivElement; 

        // Check if data is still loading
        if (dataSet.loading) { 
            messageElement.innerText = "Loading data...";
            return;
        }

        const recordCount = dataSet.sortedRecordIds.length;
        messageElement.innerText = `Number of records: ${recordCount}`;

        // Example: Log dataset columns to console for inspection (useful for debugging)
        if (dataSet.columns && dataSet.columns.length > 0) {
            console.log("Dataset Columns:", dataSet.columns.map(col => col.displayName));
        }
    }

    /** ===========================================================================================
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /** ===========================================================================================
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
