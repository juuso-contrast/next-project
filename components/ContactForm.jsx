import { useState, useEffect, useRef } from 'react'
import useTranslation from '../../lib/useTranslation'
import Link from 'next/link'
import CheckSVG from '../svg/CheckSVG'
import LoadingSpinner from '../svg/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

const ContactForm = (props) => {
	//Slider values
	const sliderValues = {
		min: 4000,
		max: 100000,
		step: 500,
	}

	//States
	const [formName, setFormName] = useState('')
	const [formCompany, setFormCompany] = useState('')
	const [formContact, setFormContact] = useState('')
	const [formAbout, setFormAbout] = useState('')
	const [formBudget, setFormBudget] = useState(sliderValues.min)
	const [sliderTouched, setSliderTouched] = useState(false)
	const [formAboutHeight, setFormAboutHeight] = useState('auto')
	const [contactError, setContactError] = useState(false)
	const [formLoading, setFormLoading] = useState(false)
	const [formValid, setFormValid] = useState(false)
	const [formSubmitted, setFormSubmitted] = useState(false)

	const sliderValuePercentage =
		((formBudget - sliderValues.min) / (sliderValues.max - sliderValues.min)) *
		100

	//Refs
	const aboutRef = useRef(null)
	const contactRef = useRef(null)

	//Effects
	useEffect(() => {
		if (formAbout) {
			setFormAboutHeight(`${aboutRef.current.scrollHeight}px`)
		} else {
			setFormAboutHeight('auto')
		}
	}, [formAbout])

	useEffect(() => {
		if (contactError) {
			setContactError(false)
		}
	}, [formContact])

	//Form lifecycle train
	function validateForm() {
		const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
			contactRef.current.value
		)

		if (!formContact || !validEmail) {
			setContactError(true)
		} else {
			// We need artifical loading times here because it's too fast otherwise
			// and feels like it's not working/going forward
			// Here we start the lifecycle train of the form submit with loading
			setFormLoading(true)
		}
	}

	useEffect(() => {
		if (formLoading) {
			setTimeout(() => {
				setFormValid(true)
			}, 1500)
		}
	}, [formLoading])

	useEffect(() => {
		if (formValid) {
			setTimeout(() => {
				//POST request to send mail api endpoint
				fetch(
					window.location.protocol +
						'//' +
						window.location.host +
						'/api/send-email',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name: formName,
							company: formCompany,
							contact: formContact,
							about: formAbout,
							budget: formBudget,
						}),
					}
				).then(() => {
					setFormSubmitted(true)
				})
			}, 800)
		}
	}, [formValid])

	return (
		<section className="contact-form contact-active">
			{!props.hideContactHeaders ? (
				<>
					<div className="middle-line"></div>
					<h2 className="grey">
						{useTranslation(props.lang, 'contact', 'formTitleFirstPart')}
					</h2>
					<p>{useTranslation(props.lang, 'contact', 'formTitleSecondPart')}</p>
				</>
			) : null}
			<AnimatePresence exitBeforeEnter>
				{formSubmitted ? (
					<motion.div
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						key="form-submit"
					>
						<div className="form-submitted">
							<h3>{useTranslation(props.lang, 'footer', 'thankyouTitle')}</h3>
							<p>{useTranslation(props.lang, 'footer', 'thankyouParagraph')}</p>
							<Link href={useTranslation(props.lang, 'footer', 'thankyouLink')}>
								<a className="button white">
									{useTranslation(props.lang, 'footer', 'thankyouLinkText')}
								</a>
							</Link>
						</div>
					</motion.div>
				) : (
					<motion.div
						animate={{ opacity: 1 }}
						initial={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						key="form"
					>
						<form
							className="contact-form"
							onSubmit={(e) => {
								e.preventDefault()
							}}
						>
							<div className="input-wrapper">
								<label htmlFor="name" className={formName ? 'show' : ''}>
									{useTranslation(props.lang, 'footer', 'nameInputLabel')}
								</label>
								<input
									type="text"
									name="name"
									className={formName ? 'active' : ''}
									placeholder={useTranslation(
										props.lang,
										'footer',
										'nameInputPlaceholder'
									)}
									onChange={(e) => {
										setFormName(e.target.value)
									}}
								/>
							</div>
							<div className="input-wrapper">
								<label htmlFor="company" className={formCompany ? 'show' : ''}>
									{useTranslation(props.lang, 'footer', 'companyInputLabel')}
								</label>
								<input
									type="text"
									name="company"
									className={formCompany ? 'active' : ''}
									placeholder={useTranslation(
										props.lang,
										'footer',
										'companyInputPlaceholder'
									)}
									onChange={(e) => {
										setFormCompany(e.target.value)
									}}
								/>
							</div>
							<div className="input-wrapper">
								<label htmlFor="contact" className={formContact ? 'show' : ''}>
									{useTranslation(props.lang, 'footer', 'contactInputLabel')}
								</label>
								<input
									type="text"
									name="contact"
									ref={contactRef}
									className={
										(formContact ? 'active ' : '') +
										(contactError ? 'error' : '')
									}
									placeholder={useTranslation(
										props.lang,
										'footer',
										'contactInputPlaceholder'
									)}
									onChange={(e) => {
										setFormContact(e.target.value)
									}}
								/>
								{contactError ? (
									<span className="error">
										{useTranslation(props.lang, 'footer', 'contactError')}
									</span>
								) : (
									''
								)}
							</div>
							<div className="input-wrapper">
								<label htmlFor="about" className={formAbout ? 'show' : ''}>
									{useTranslation(props.lang, 'footer', 'aboutInputLabel')}
								</label>
								<textarea
									rows="1"
									type="text"
									name="about"
									ref={aboutRef}
									style={{
										height: formAboutHeight,
									}}
									className={formAbout ? 'active' : ''}
									placeholder={useTranslation(
										props.lang,
										'footer',
										'textInputPlaceholder'
									)}
									onChange={(e) => {
										setFormAbout(e.target.value)
									}}
								/>
							</div>
							<div className="input-wrapper">
								<label htmlFor="budget" className={sliderTouched ? 'show' : ''}>
									{useTranslation(props.lang, 'footer', 'budgetInputLabel')}
								</label>
								<div
									className="budget-display"
									style={
										sliderTouched
											? {}
											: {
													fontStyle: 'italic',
													color: '#8a8d92',
											  }
									}
								>
									{sliderTouched
										? formBudget +
										  (formBudget == sliderValues.max ? '+' : '') +
										  ' €'
										: useTranslation(
												props.lang,
												'footer',
												'budgetInputPlaceholder'
										  )}
								</div>
								<input
									name="budget"
									type="range"
									min={sliderValues.min}
									max={sliderValues.max}
									step={sliderValues.step}
									className="slider"
									value={formBudget}
									onChange={(e) => {
										setFormBudget(e.target.value)
										if (!sliderTouched) setSliderTouched(true)
									}}
									style={{
										background: `linear-gradient(to right, black 0%, black ${sliderValuePercentage}%, #cad2d9 ${sliderValuePercentage}%, #cad2d9 100%)`,
									}}
								/>
								<div className="min-budget-label">min {sliderValues.min}€</div>
							</div>

							<button className="black" type="submit" onClick={validateForm}>
								{formLoading ? (
									formValid ? (
										<CheckSVG />
									) : (
										<LoadingSpinner />
									)
								) : (
									useTranslation(props.lang, 'footer', 'sendButtonText')
								)}
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
			<style jsx>{`
				section.contact-form {
					padding: 85px 20px 105px 20px;
					text-align: center;
					position: relative;
				}

				.middle-line {
					top: 0;
					height: 60px;
					background-color: black;
				}

				h2 {
					font-size: 40px;
					margin-bottom: 8px;
				}

				p {
					margin-bottom: 40px;
				}

				@media only screen and (min-width: 768px) {
					h2 {
						font-size: 48px;
					}
				}
			`}</style>
		</section>
	)
}

export default ContactForm
