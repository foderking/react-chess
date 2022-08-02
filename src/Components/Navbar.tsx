 import React from 'react'


export default function Navbar(): JSX.Element {
	return(
		<nav id='nav' className="navbar navbar-expand-lg navbar-dark ">
			<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
				data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
				aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<a className="navbar-brand" href="#!">
				<img src="https://i.imgur.com/ky3AW06.png" width="30" height="30" className="d-inline-block align-top" alt=""></img>
				{/* Light-Chess */}
			</a>

			<div className="collapse navbar-collapse" id="navbarTogglerDemo03">
				<ul className="navbar-nav mr-auto mt-2 mt-md-0">
					<li className="nav-item active">
						<a className="nav-link" href="#!">Home
							{/* <span className="sr-only">(current)</span> */}
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#!">Link</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#!">Disabled</a>
					</li>
				</ul>
			</div>
		</nav>
	)
 }