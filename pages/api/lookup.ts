import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// }

const cors = Cors({
	allowMethods: ['POST', 'HEAD'],
})

const iCensusYear = '2019'
async function Endpoint(req: NextApiRequest, res: NextApiResponse) {
	const sSingleLine = req.body
	let response
	let json

	response = await fetch(
		'https://geomap.ffiec.gov/FFIECGeocMap/GeocodeMap1.aspx/GetGeocodeData',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				sSingleLine,
				iCensusYear,
			}),
		},
	)

	json = await response.json()
	const { sAddress, sMSACode, sStateCode, sCountyCode, sTractCode } = json?.d

	if (!sAddress) {
		res.json({
			match: false,
		})
		return
	}

	response = await fetch(
		'https://geomap.ffiec.gov/FFIECGeocMap/GeocodeMap1.aspx/GetCensusData',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				sMSACode,
				sStateCode,
				sCountyCode,
				sTractCode,
				iCensusYear,
			}),
		},
	)

	json = await response.json()
	res.json({
		match: true,
		status: json?.d?.sIncome_Indicator,
	})
}

// @ts-ignore
export default cors(Endpoint)
