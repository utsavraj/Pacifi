import React from 'react'
import { WebView } from 'react-native'

const Canvas = ({ context, render, style }) => {
  const contextString = JSON.stringify(context)
  const renderString = render.toString()
  const jsCode = `var canvas = document.querySelector("canvas");(${renderString}).call(${contextString}, canvas)`

  return (
    <WebView
      source={{html: `<style>*{margin:0;padding:0}canvas{transform:translateZ(0)}</style><canvas width="${style.width + 1}" height="${style.height + 1}"></canvas>`}}
      injectedJavaScript={jsCode}
      style={style}
    />
  )
}

export default Canvas
