import { useState, useEffect, useRef } from 'react'
import { NextPage } from 'next'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import LinearProgress from '@material-ui/core/LinearProgress'

import ErrorIcon from '@material-ui/icons/Error'

interface Address {
	id: string
	address: string
	status?: string
	match?: boolean
}

const useStyles = makeStyles(theme => ({
	address: {
		marginTop: theme.spacing(1),
		padding: theme.spacing(1),
		textAlign: 'left',
	},
	status: {
		marginRight: theme.spacing(1),
	},
}))

let uuid = 0
const uid = () => `${new Date().getTime()}${uuid++}`
const Page: NextPage = () => {
	const classes = useStyles()
	const inputEl = useRef<HTMLInputElement>(null)
	const [addresses, setAddresses] = useState<Array<Address>>([])

	useEffect(() => {
		function search(evt: KeyboardEvent) {
			if (evt.key !== 'Enter') return

			if (inputEl.current) {
				const address = inputEl.current.value
				setAddresses(existing => [{ id: uid(), address }, ...existing])
				fetch('api/lookup', {
					method: 'POST',
					body: address,
				}).then(async response => {
					const { status, match } = await response.json()
					setAddresses(existing => {
						const record = existing.find(a => a.address === address)
						record!.match = match
						record!.status = status
						return Array.from(existing)
					})
				})
				inputEl.current.value = ''
			}
		}

		document.addEventListener('keyup', search)
		return () => {
			document.removeEventListener('keyup', search)
		}
	}, [])

	return (
		<main>
			<div id="container">
				<h1>Connections Eligibility</h1>
				<TextField
					inputRef={inputEl}
					label="Address"
					variant="outlined"
					fullWidth
				/>
				<div>
					{addresses.map(address => {
						const status = address.status || 'Pending'
						let statusStyle: any

						switch (true) {
							case /pending|unknown/i.test(status):
								statusStyle = { background: 'yellow', color: '#333' }
								break
							case /low|moderate/i.test(status):
								statusStyle = { background: 'green' }
								break
							default:
								statusStyle = { background: 'red' }
						}

						const feedback =
							address.match === false ? (
								<Chip
									icon={<ErrorIcon />}
									className={classes.status}
									label="Error"
									style={{ background: 'red' }}
								/>
							) : (
								<Chip
									className={classes.status}
									label={status}
									style={statusStyle}
								/>
							)

						return (
							<Paper className={classes.address} elevation={0} key={address.id}>
								<Typography>
									{feedback}
									{address.address}
								</Typography>
								{address.match == null && <LinearProgress />}
							</Paper>
						)
					})}
				</div>
			</div>
		</main>
	)
}

export default Page
