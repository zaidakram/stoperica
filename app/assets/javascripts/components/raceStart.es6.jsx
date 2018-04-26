class RaceStart extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedRaceId: 0,
      raceStarted: false,
      categories: [],
      selectedCategories: []
    }
  }

  selectRace(event) {
    let raceId = event.target.value;
    let ajax = new Ajax(
      `/races/${raceId}.json`,
      data => {
        if(data.started_at) {
          RaceResultActions.startRace(new Date(data.started_at));
          this.setState({ raceStarted: true });
        }
        RaceResultActions.setRace(raceId);
        this.setState({
          selectedRaceId: raceId,
          categories: data.categories
        });
      },
      (error, status) => {
        console.log(error, status);
      }
    );

    ajax.get();
  }

  startRace() {
    const { selectedCategories, selectedRaceId, categories } = this.state;
    let data = {
      started_at: timeSync.now(),
      categories: selectedCategories
    }
    let ajax = new Ajax(
      `/races/${selectedRaceId}`,
      data => {
        const updatedCategories = categories.map(c => {
          if (selectedCategories.indexOf(c.id.toString()) > -1) {
            c['started?'] = true;
          }
          return c;
        });
        this.setState({
          raceStarted: true,
          selectedCategories: [],
          categories: updatedCategories
        });
        RaceResultActions.startRace(new Date(data.started_at));
        RaceResultActions.setRace(selectedRaceId);
        const startedCategories = categories.map(c => {
          if (selectedCategories.includes(c.id.toString())) return c.name;
        });
        window.alert(`Startali: ${startedCategories.join(', ')}`)
      },
      (error, status) => {
        console.log(error, status);
      }
    );

    ajax.put(data);
  }

  endRace() {
    let data = {
      ended_at: timeSync.now()
    }
    let ajax = new Ajax(
      `/races/${this.state.selectedRaceId}`,
      (data) => {
        window.location = `/races/${this.state.selectedRaceId}`;
      },
      (error, status) => {
        console.log(error, status);
      }
    );
    ajax.put(data);
  }

  handleCategoryChange({ target }, category) {
    const { selectedCategories } = this.state;
    if (target.checked) {
      selectedCategories.push(target.value);
    }
    else {
      const index = selectedCategories.indexOf(target.value);
      selectedCategories.splice(index, 1);
    }
    this.setState({ selectedCategories })
  }

  render () {
    const {races} = this.props;
    return (
      <span>
        <span>
          <select
            name=""
            id=""
            style={{ width: '180px', marginRight: '2em' }}
            onChange={ this.selectRace.bind(this) }
          >
            <option value="0">Odaberi utrku</option>
            {
              races.map((race)=>{
                return <option key={`race-select-${race.id}`} value={race.id}>{race.name}</option>;
              })
            }
          </select>
          {
            this.state.raceStarted ?
            (
             <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect"
                onClick={ this.endRace.bind(this) }
              >
                Finish
              </button>
            )
            :
            null
          }
          {
            this.state.selectedRaceId ?
            (
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
                onClick={ this.startRace.bind(this) }
              >
                Start
              </button>
            )
            :
            null
          }
          <ul className="timing-category-list">
            {
              this.state.categories.map(c => {
                return (
                  <li key={c.id}>
                    <input
                      type="checkbox"
                      value={c.id}
                      onChange={ event => this.handleCategoryChange(event, c) }
                    />
                    <label className={ c['started?'] ? 'started' : '' }>
                      {c.name}
                    </label>
                  </li>
                );
              })
            }
          </ul>
        </span>
        <RaceTime />
        {
          this.state.raceStarted ?
          <p> Utrka startala: <b>{(new Date(DraftResultStore.getRaceStartDate())).toLocaleString()}</b></p>
          :
          null
        }
      </span>
    );
  }
}
