import "./styles.css";
import React from "react";
import { useContext, useEffect, useReducer } from "react";
import { useInView } from "react-intersection-observer";

const Box = ({
  color,
  height,
  dispatchInView,
  dispatchRemoveInView,
  useInView,
  idx
}) => {
  const { ref, entry, inView } = useInView();

  React.useEffect(() => {
    if (inView) {
      dispatchInView({ entry, ref });
    } else {
      dispatchRemoveInView({ entry, ref });
    }
  }, [inView]);

  return (
    <div
      style={{ height: height, backgroundColor: color, border: "15px" }}
      ref={ref}
    >
      <h1>{`${color}`}</h1>
    </div>
  );
};

const Menu = ({ menu }) => {
  console.log("%c --------", "color:aqua", useInViewContext());
  return (
    <ul
      style={{
        background: "yellowgreen",
        padding: "5px",
        width: "130px",
        zIndex: 10,
        position: "fixed"
      }}
    >
      {menu.map(({ color, height, inView }) => (
        <div
          style={{ height: 50, color: color }}
        >{`${color}: ${height} -- inView`}</div>
      ))}
    </ul>
  );
};

const ACTIONS = {
  SET_ELEMENTS: "setElements",
  // there may be multiple elements visible in viewport, but we only want 1 "in view"
  SET_IN_VIEW: "setInView",
  REMOVE_IN_VIEW: "removeInView"
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ELEMENTS: {
      debugger;
      return {
        ...state,
        menu: action.payload.colors.reduce((acc, color, idx) => {
          acc.push({
            color: color,
            height: action.payload.height[idx],
            useInView: function () {
              return useInView();
            }
          });
          return acc;
        }, [])
      };
    }
    case ACTIONS.SET_IN_VIEW: {
      const { entry, key } = action.payload;
      const clonedMap = new Map(state.visibleElements);
      if (entry) {
        clonedMap.set(key, {
          entry,
          key
        });
      }

      return {
        ...state,
        visibleElements: clonedMap
      };
    }
    default:
      return state;
  }
};

const InViewContext = React.createContext();
export const useInViewContext = () => React.useContext(InViewContext);

const useInViewStore = (initialState) => {
  const [state, dispatch] = React.useReducer(reducer, {
    trackedElements: new Set(),
    visibleElements: new Map()
  });

  return {
    actions: {},
    dispatch: {
      dispatchSetInitialElements: function ({ colors, heights }) {
        console.log("----here---", colors, heights);
        debugger;
        dispatch({
          action: ACTIONS.SET_ELEMENTS,
          payload: {
            colors,
            heights
          }
        });
      }
    },
    state: {
      ...state
    }
  };
};

export default function App() {
  const { dispatch, state } = useInViewStore();

  React.useEffect(() => {
    console.log(" -- here --");
    dispatch.dispatchSetInitialElements({
      colors: ["#3a86ff", "#8338ec", "#ff006e", "#fb5607", "#ffbe0b"],
      heights: [500, 300, 900, 200, 400]
    });
  }, [dispatch]);

  console.log(" --state.menu", state);
  return (
    <div className="App">
      <InViewContext.Provider value={state}>
        {/* <Menu menu={state.menu} />
      {state.menu.map(
        (
          { color, height, inView, dispatchInView, dispatchRemoveInView },
          idx
        ) => {
          return (
            <Box
              color={color}
              dispatchInView={dispatchInView}
              dispatchRemoveInView={dispatchRemoveInView}
              height={height}
              idx={idx}
              useInView={useInView}
            />
          );
        }
      )} */}
      </InViewContext.Provider>
    </div>
  );
}

// colors: initialState.colors,
// height: initialState.height,
// visibleElements: state.visibleElements,
// menu: initialState.colors.reduce((acc, color, idx) => {
//   acc.push({
//     color: color,
//     height: initialState.height[idx],
//     useInView: function () {
//       return useInView();
//     },
//     dispatchInView: function ({ entry, ref }) {
//       dispatch({
//         type: ACTIONS.SET_IN_VIEW,
//         payload: {
//           key: color,
//           entry,
//           ref
//         }
//       });
//     },
//     dispatchRemoveInView: function ({ entry, ref }) {
//       dispatch({
//         type: ACTIONS.REMOVE_IN_VIEW,
//         payload: {
//           key: color,
//           entry,
//           ref
//         }
//       });
//     }
//   });
//   return acc;
// }, [])
