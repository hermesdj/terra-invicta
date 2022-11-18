class Searchbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: [], showProjects: true, selectedLang: 'fr', languages: [{value: 'fr', text: 'Francais'}, {value: 'en', text: 'English'}] };
    }

    componentDidMount() {
    }

    componentDidUpdate() {

    }

    render() {
        return React.createElement(
            MaterialUI.Paper,
            { elevation: 3, id: "searchBox" },
            React.createElement(
                MaterialUI.Autocomplete,
                {
                    options: this.state.results,
                    renderInput: (params) => {
                        params.label = "Search";
                        params.ref = inputEl => { this.searchInput = inputEl };
                        params.autoFocus = true;

                        return React.createElement(
                            MaterialUI.TextField,
                            params
                        )
                    },
                    freeSolo: true,
                    onInputChange: (event, value) => {
                        const results = documentSearchIndex.search(value, { pluck: "friendlyName", enrich: true }).map(result => {
                            return {label: result.doc.friendlyName, id: result.doc.dataName};
                        });
                        this.setState({ results: results });
                    },
                    onChange: (event, value) => {
                        showSidebar();

                        let navigateToNode = techTree.find(tech => tech.dataName === value.id);
                        techSidebar.setState({ node: navigateToNode });

                        if (navigateToNode && network.body.nodes[navigateToNode.dataName]) {
                            network.selectNodes([navigateToNode.dataName]);
                            network.focus(navigateToNode.dataName);
                            updateLocationHash(navigateToNode.dataName);
                        }
                    }
                }
            ),
            React.createElement(
                MaterialUI.FormControlLabel,
                {
                    label: "Show Projects",
                    control: React.createElement(
                        MaterialUI.Switch,
                        {
                            defaultChecked: true,
                            onChange: (event) => {
                                const showToggle = event.target.checked;
                                if (showToggle) {
                                    this.setState({ showProjects: true });
                                    parseDefaults();
                                } else {
                                    this.setState({ showProjects: false });
                                    parseTechsOnly();
                                }
                            }
                        }
                    ),
                    id: "showProjects"
                }
            ),
            React.createElement(
                MaterialUI.Select,
                {
                    defaultValue: selectedLang,
                    native: true,
                    children: this.state.languages.map(
                        ({value, text}) => React.createElement('option', {
                            value
                        }, text)
                    ),
                    onChange: (event) => {
                        const localSelectedLang = event.target.value;
                        selectedLang = localSelectedLang;
                        this.setState({ selectedLang });
                        redraw();
                    },
                    id: 'selectLang'
                }
            )
        )
    }
}
