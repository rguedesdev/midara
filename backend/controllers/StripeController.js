import stp from "stripe";
const stripe = stp(process.env.STRIPE_SECRET_KEY);
import { UserModel } from "../models/UserModel.js";

// Middlewares
import getUserByToken from "../helpers/get-user-by-token.js";
import getToken from "../helpers/get-token.js";

class StripeController {
	static async prices(req, res) {
		const prices = await stripe.prices.list();

		console.log("prices", prices);

		res.json(prices.data.reverse());
	}

	static async createSubscription(req, res) {
		const token = getToken(req);

		// Verificar se o usuário existe
		const user = await getUserByToken(token);

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado!" });
			return;
		}

		try {
			const session = await stripe.checkout.sessions.create({
				mode: "subscription",
				payment_method_types: ["card"],
				line_items: [
					{
						price: req.body.priceId,
						quantity: 1,
					},
				],
				customer: user.stripe_customer_id,
				success_url: process.env.STRIPE_SUCCESS_URL,
				cancel_url: process.env.STRIPE_CANCEL_URL,
			});

			console.log("Checkout session", session);

			res.json(session.url);
		} catch (err) {
			console.log(err);
		}
	}

	static async getStatus(req, res) {
		const token = getToken(req);

		// Verificar se o usuário existe
		const user = await getUserByToken(token);

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado!" });
			return;
		}

		try {
			//Status vindo do Stripe
			const subscription = await stripe.subscriptions.list({
				customer: user.stripe_customer_id,
				status: "all",
				expand: ["data.default_payment_method"],
			});

			// Atualização do usuário no banco de dados
			const updated = await UserModel.findByIdAndUpdate(
				user._id,
				{
					subscriptionInfo: subscription.data,
				},
				{ new: true }
			);

			res.json(updated);
		} catch (err) {
			console.log(err);
		}
	}

	static async subscriptionInfo(req, res) {
		const token = getToken(req);

		// Verificar se o usuário existe
		const user = await getUserByToken(token);

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado!" });
			return;
		}

		try {
			//Status vindo do Stripe
			const subscription = await stripe.subscriptions.list({
				customer: user.stripe_customer_id,
				status: "all",
				expand: ["data.default_payment_method"],
			});

			res.json(subscription);
		} catch (err) {
			console.log(err);
		}
	}

	static async customerPortal(req, res) {
		const token = getToken(req);

		// Verificar se o usuário existe
		const user = await getUserByToken(token);

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado!" });
			return;
		}

		try {
			const portalSession = await stripe.billingPortal.sessions.create({
				customer: user.stripe_customer_id,
				return_url: process.env.STRIPE_SUCCESS_URL,
			});
			res.json(portalSession.url);
		} catch (err) {
			console.log(err);
		}
	}

	// Método estático para lidar com o webhook do Stripe
	static async webhookStripe(req, res) {
		const sig = req.headers["stripe-signature"];
		const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
		const payload = req.rawBody || req.body.toString("utf8");
		let event;
		try {
			event = stripe.webhooks.constructEvent(
				payload,
				sig,
				endpointSecret
			);
		} catch (error) {
			console.error(`Webhook Error: ${error.message}`);
			return res.status(400).json({ success: false });
		}
		// Handle the event
		switch (event.type) {
			case "payment_intent.succeeded":
				// Código para lidar com o evento de pagamento bem-sucedido
				break;

			case "customer.subscription.deleted":
				const customerSubsDeleted = event.data.object;
				const stripeCustomerIdDeleted = customerSubsDeleted.customer;

				try {
					// Encontre o usuário correspondente no banco de dados com base no stripe_customer_id
					const userDeleted = await UserModel.findOne({
						stripe_customer_id: stripeCustomerIdDeleted,
					});

					if (!userDeleted) {
						console.log(
							`Usuário com stripe_customer_id ${stripeCustomerIdDeleted} não encontrado.`
						);
						break;
					}

					// Verifique se há outras assinaturas ativas
					const hasActiveSubscriptions =
						userDeleted.subscriptionInfo.some(
							(subscription) =>
								subscription.status === "active" &&
								subscription.id !== customerSubsDeleted.id
						);

					if (!hasActiveSubscriptions) {
						// Atualize o documento no banco de dados para definir status como "canceled" e remover o campo "active"
						await UserModel.updateOne(
							{
								_id: userDeleted._id,
								"subscriptionInfo.id": customerSubsDeleted.id,
							},
							{
								$set: {
									"subscriptionInfo.$.status": "canceled",
								},
								$unset: {
									"subscriptionInfo.$.plan.active": 1,
								},
							}
						);

						console.log(
							`Usuário com stripe_customer_id ${stripeCustomerIdDeleted} atualizado. active removido e status definido como canceled.`
						);
					} else {
						console.log(
							`Usuário com stripe_customer_id ${stripeCustomerIdDeleted} possui outras assinaturas ativas. Não foi feita nenhuma alteração.`
						);
					}
				} catch (error) {
					console.error(`Erro ao atualizar o usuário: ${error}`);
				}
				break;

			default:
				console.log(`Tipo de evento não tratado: ${event.type}`);
		}
		// Return a 200 response to acknowledge receipt of the event
		return res.status(200).json({ received: true });
	}
}

export default StripeController;
