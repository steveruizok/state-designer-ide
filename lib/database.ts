import * as Types from "types"

import db from "utils/firestore"
import router from "next/router"

// New

/* 
Database structure

users: collection
  user: document
    id: string
    exists: boolean
    dateCreated: string
    dateLastLoggedIn: string
    projects: collection
      project: document
        id: string
        name: string
        ownerId: string
        dateCreated: string
        lastModified: string
        payloads: {
          [eventName]: string
        }
        code: {
          state: string
          view: string
          static: string
        }
*/

// Keep me
export function getNewProject(
  uid: string,
  dateString: string,
  name = "Toggle",
) {
  return {
    name,
    dateCreated: dateString,
    lastModified: dateString,
    ownerId: uid,
    payloads: {
      TOGGLED: "",
      DECREMENTED: "",
      INCREMENTED: "",
    },
    code: {
      state: `export default createState({
	data: {
		count: 0,
	},
	initial: 'turnedOff',
	states: {
		turnedOff: {
			on: {
				TOGGLED: {
					to: 'turnedOn',
				},
			},
		},
		turnedOn: {
			on: {
				TOGGLED: {
					to: 'turnedOff',
				},
				DECREMENTED: {
					unless: 'atMin',
					do: 'decrement',
				},
				INCREMENTED: {
					unless: 'atMax',
					do: 'increment',
				},
			},
		},
	},
	conditions: {
		atMin(data) {
			return data.count <= 0;
		},
		atMax(data) {
			return data.count >= 10;
		},
	},
	actions: {
		increment(data) {
			data.count++;
		},
		decrement(data) {
			data.count--;
		},
	},
});
`,
      view: `import state from './state';

export default function App() {
	const local = useStateDesigner(state);

	return (
		<View>
			<Container>
				<Flex>
					<Heading>{local.data.count}</Heading>
				</Flex>
				<IconButton
					disabled={!local.can('DECREMENTED')}
					onClick={() => state.send('DECREMENTED')}
				>
					<Icons.Minus />
				</IconButton>
				<IconButton
					disabled={!local.can('INCREMENTED')}
					onClick={() => state.send('INCREMENTED')}
				>
					<Icons.Plus />
				</IconButton>
				<Button onClick={() => state.send('TOGGLED')}>
					Turn {local.whenIn({ turnedOff: 'On', turnedOn: 'Off' })}
				</Button>
			</Container>
		</View>
	);
}
`,
      static: `export default function getStatic() {
	return {
		title: 'Counter',
	};
}
`,
    },
  }
}
