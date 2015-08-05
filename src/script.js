var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      degree: 1
    };
  },


  render: function render() {
    return (
      React.createElement("div", {id: "container"}, 
      React.createElement(PeerList, null),
      React.createElement(FileList, null)
      )
    );
  }
})

var PeerList = React.createClass({
  displayName: 'PeerList',

  getInitialState: function getInitialState() {
    return {
      peers: []
    };
  },

  componentDidMount: function() {
    console.log(this.props.source);
    $.get("/peers", function(result) {
      if (this.isMounted()) {
        this.setState({
          peers: result
        });
      }
    }.bind(this));
  },

  onDrop: function (files) {
    console.log('Received files: ', files);
    this.setState({
      files: files
    });
  },

  render: function render() {
    var peerNodes = this.state.peers.map(function(peer, index) {
        return React.createElement(Peer, {IPV6: peer.IPV6, state: peer.State, key: index});
    });

    return (
      React.createElement("div", {className: "peerList"}, peerNodes)
    );
  }
});

var Peer = React.createClass({displayName: "Peer",

  render: function() {
    var url = '/peer/' + this.props.IPV6

    // Do this better
    var color;
    if (this.props.state == "ESTABLISHED")
      color = "#00c800"
    else
      color = "#b3b3b3"
          // <Dropzone>
      // </Dropzone>

    return (
      <div className="peer">

      <SVGComponent height="14" width="15">
          <Circle
          cx="6" cy="9" r="5" 
          fill={color} />
      </SVGComponent>
      <a className="peerIP" href={url}>
        {this.props.IPV6}
      </a>
      </div>
    );
  }
})

var FileList = React.createClass({
  getInitialState: function getInitialState() {
    return {
      files: []
    };
  },

  componentDidMount: function() {
    $.get("/posts", function(result) {
      console.log(result)
      if (this.isMounted()) {
        this.setState({
          files: result
        });
      }
    }.bind(this));
  },

  render: function() {
    var files = this.state.files.map(function(file, index) {
        return React.createElement(File, {name: file.Name, key: index}); // Size, icon, what else?
    });

    return (
      React.createElement("div", {className: "fileList"}, files)
    );
  }
})

var File = React.createClass({
  render: function() {

    

    return (
      <div className="file">
        <SVGComponent id="icon" height="50" width="50">
        <Rectangle
        height="50" width="50" x="0" y="0"
        fill="black" />
        </SVGComponent>
        <h2>{this.props.name}</h2>
      </div>
    );
  }
})

var Dropzone = React.createClass({
  getDefaultProps: function() {
    return {
      supportClick: true,
      multiple: true
    };
  },

  getInitialState: function() {
    return {
      isDragActive: false
    };
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool
  },

  onDragLeave: function(e) {
    this.setState({
      isDragActive: false
    });
  },

  onDragOver: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true
    });
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    var maxFiles = (this.props.multiple) ? files.length : 1;
    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  },

  onClick: function () {
    if (this.props.supportClick === true) {
      this.open();
    }
  },

  open: function() {
    React.findDOMNode(this.refs.fileInput).click();
  },

  render: function() {

    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    }

    var style = this.props.style || {
      width: this.props.size || 100,
      height: this.props.size || 100,
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
    };


    return (
        React.createElement('div', {className: className, style: style, onClick: this.onClick, onDragLeave: this.onDragLeave, onDragOver: this.onDragOver, onDrop: this.onDrop},
            React.createElement('input', {style: {display: 'none'}, type: 'file', multiple: this.props.multiple, ref: 'fileInput', onChange: this.onDrop, accept: this.props.accept}),
            this.props.children
        )
    );
  }

});

var SVGComponent = React.createClass({
    render: function() {
        return <svg {...this.props}>{this.props.children}</svg>;
    }
});

var Circle = React.createClass({
    render: function() {
        return <circle {...this.props}>{this.props.children}</circle>;
    }
});

var Rectangle = React.createClass({
    render: function() {
        return <rect {...this.props}>{this.props.children}</rect>;
    }
});

React.render(React.createElement(App, null), document.body);



// Main App
  // Degree slider
  // Peer graph
    // Peer
    // Self



