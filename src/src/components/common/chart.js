import { jsPlumb } from 'jsplumb'
// import { connect } from 'net';
export function draw (vals) {
  var values = vals
  jsPlumb.ready(function () {
    // console.log('draw');
    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
      Endpoint: ['Dot', { radius: 1, cssClass: 'dragHover' }],
      ConnectionOverlays: [
        ['Arrow', {
          location: 1,
          id: 'arrow',
          length: 14,
          foldback: 0.8
        }],
        ['Label', { id: 'label', cssClass: 'aLabel' }]
      ],
      Container: 'canvas'
    })
    instance.registerConnectionType('basic', {
      anchor: 'Continuous',
      hoverPaintStyle: { stroke: '#00BBC4', strokeWidth: 3 },
      paintStyle: { stroke: '#343434', strokeWidth: 2 },
      // connector: ["Bezier", { stub: [0, 1], gap: 2, cornerRadius: 5, alwaysRespectStubs: true }]
      connector: ['Straight']
    })

    window.jsp = instance

    // var canvas = document.getElementById('canvas');

    var initNode = function (el) {
      // initialise draggable elements.
      instance.draggable(el, function (data) {
        // console.log(data)
      })

      instance.makeSource(el, {
        filter: '.ep',
        anchor: 'Continuous',
        connectorStyle: { stroke: '#5c96bc', strokeWidth: 2, outlineStroke: 'transparent', outlineWidth: 4 },
        connectionType: 'basic',
        extract: {
          'action': 'the-action'
        },
        // maxConnections: 2,
        onMaxConnections: function (info, e) {
          alert('Maximum connections (' + info.maxConnections + ') reached')
        }
      })

      instance.makeTarget(el, {
        dropOptions: { hoverClass: 'dragHover' },
        anchor: 'Continuous',
        allowLoopback: true
      })

      instance.fire('jsPlumbDemoNodeAdded', el)
    }

    // suspend drawing and initialise.
    instance.batch(function () {
      var windows = jsPlumb.getSelector('.canvas .window')
      for (var i = 0; i < windows.length; i++) {
        // initNode(windows[i], true);
        initNode(windows[i])
      }
      values.forEach(item => {
        let html
        if (item.label) {
          html = `<p style="display: flex;flex-direction: column;text-align: center;background-color: #fff;">
                    <span style="font-size: 14px;">${item.label}</span>
                    <span style="font-size: 12px;color: #666;">${item.relation}</span>
                </p>`
        } else {
          html = `<p style="display: flex;flex-direction: column;text-align: center;background-color: #fff;">
                    <span style="font-size: 14px;">无</span>
                </p>`
        }

        connectNode(item.startNode, item.endNode, html)
      })
    })

    function connectNode (source, targets, label) {
      for (var i = 0; i < targets.length; i++) {
        let conn = instance.connect({
          source: source,
          target: targets[i],
          type: 'basic'
        })

        conn.setLabel(label)
      }
    }

    jsPlumb.fire('jsPlumbDemoLoaded', instance)
    jsPlumb.setContainer('canvas')

    window.setZoom = function (zoom, instance, transformOrigin, el) {
      transformOrigin = transformOrigin || [0.5, 0.5]
      instance = instance || jsPlumb
      el = el || instance.getContainer()
      var p = ['webkit', 'moz', 'ms', 'o'],
        s = 'scale(' + zoom + ')',
        oString = (transformOrigin[0] * 100) + '% ' + (transformOrigin[1] * 100) + '%'

      for (var i = 0; i < p.length; i++) {
        el.style[p[i] + 'Transform'] = s
        el.style[p[i] + 'TransformOrigin'] = oString
      }

      el.style['transform'] = s
      el.style['transformOrigin'] = oString

      instance.setZoom(zoom)
    }
  })
}
