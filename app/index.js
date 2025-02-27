microsoftTeams.initialize(() => {}, [
  "https://jofri-msft.github.io",
]);

// This is the effect for processing
let appliedEffect = {
  pixelValue: 100,
  proportion: 3,
};

// This is the effect linked with UI
let uiSelectedEffect = {};

let errorOccurs = false;
//Sample video effect
function videoFrameHandler(videoFrame, notifyVideoProcessed, notifyError) {
  // const maxLen =
  //   (videoFrame.height * videoFrame.width) /
  //     Math.max(1, appliedEffect.proportion) - 4;
  const maxLen = (videoFrame.height * videoFrame.width)

  // for (let i = 1; i < maxLen; i += 4) {
  //   //smaple effect just change the value to 100, which effect some pixel value of video frame
  //   videoFrame.data[i + 1] = appliedEffect.pixelValue;
  // }

  // for (let i = 0; i < maxLen; i +=2) {
  //   //smaple effect just change the value to 100, which effect some pixel value of video frame
  //   videoFrame.data[i] = 255 - videoFrame.data[i];
  // }

  for (let i = 0; i < maxLen; i ++) {
    //smaple effect just change the value to 100, which effect some pixel value of video frame
    if (videoFrame.data[i] < 127) {
      videoFrame.data[i] = 0;
    }
    else if (videoFrame.data[i] > 127) {
      videoFrame.data[i] = 255;
    }
  }

  //send notification the effect processing is finshed.
  notifyVideoProcessed();

  //send error to Teams
  if (errorOccurs) {
    notifyError("some error message");
  }
}

function effectParameterChanged(effectName) {
  console.log(effectName);
  if (effectName === undefined) {
    // If effectName is undefined, then apply the effect selected in the UI
    appliedEffect = {
      ...appliedEffect,
      ...uiSelectedEffect,
    };
  } else {
    if (effectName === "f36d7f68-7c71-41f5-8fd9-ebf0ae38f949") {
      appliedEffect.proportion = 2;
      appliedEffect.pixelValue = 200;
    } else if (effectName === "dd098f09-d41a-4f3f-abe6-076f5f743b27") {
      appliedEffect.proportion = 2;
      appliedEffect.pixelValue = 200;
    }else {
      // if effectName is string sent from Teams client, the apply the effectName
      try {
        appliedEffect = {
          ...appliedEffect,
          ...JSON.parse(effectName),
        };
      } catch (e) {}
    }
  }
}

microsoftTeams.appInitialization.notifySuccess();
microsoftTeams.video.registerForVideoEffect(effectParameterChanged);
microsoftTeams.video.registerForVideoFrame(videoFrameHandler, {
  format: "NV12",
});

// any changes to the UI should notify Teams client.
document.getElementById("enable_check").addEventListener("change", function () {
  if (this.checked) {
    microsoftTeams.video.notifySelectedVideoEffectChanged("EffectChanged");
  } else {
    microsoftTeams.video.notifySelectedVideoEffectChanged("EffectDisabled");
  }
});
document.getElementById("proportion").addEventListener("change", function () {
  uiSelectedEffect.proportion = this.value;
  microsoftTeams.video.notifySelectedVideoEffectChanged("EffectChanged");
});
document.getElementById("pixel_value").addEventListener("change", function () {
  uiSelectedEffect.pixelValue = this.value;
  microsoftTeams.video.notifySelectedVideoEffectChanged("EffectChanged");
});
