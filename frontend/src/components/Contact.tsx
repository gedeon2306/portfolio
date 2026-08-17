import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { useScrollReveal } from "./useScrollReveal";
import { useToast } from "../context/ToastContext";
import Spinner from "./Spinner";
import logoJdBlanc from "../assets/logo_jd_blanc_sbg.png";
import "../css/Contact.css";

interface ContactItem {
  icon: typeof FiMail;
  label: string;
  value: string;
  actionText?: string;
}

const CONTACT_INFO: ContactItem[] = [
  { icon: FiMail, label: "Email Professionnel", value: "contact@Jihreldev.com", actionText: "Copier l'email" },
  { icon: FiMapPin, label: "Localisation", value: "Paris, France", actionText: "Fuseau CET (UTC+1)" },
  { icon: FiPhone, label: "Téléphone", value: "+33 6 00 00 00 00", actionText: "Copier le numéro" },
];

const SOCIALS = [
  { icon: FiGithub, href: "https://github.com", label: "GitHub" },
  { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter / X" },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const toast = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (status === "error" || status === "sent") {
        setStatus("idle");
      }
    };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success("Copié !", `${label} a été copié dans le presse-papier.`);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.message) {
      toast.error("Formulaire incomplet", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("sending");
    try {
      // Simulation d'envoi réseau avec latence réaliste
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("sent");
      toast.success(
        "Message envoyé avec succès !",
        `Merci ${values.name}, je vous répondrai dans les plus brefs délais.`
      );
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      toast.error(
        "Erreur d'envoi",
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    }
  };

  return (
    <section id="contact" className="pf-contact">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Contact & Collaboration</span>
          <h2 className="pf-section-title">Discutons de votre projet</h2>
          <p className="pf-section-subtitle">
            Vous avez une idée, une opportunité ou un défi technique à relever ? Écrivez-moi et donnons vie à vos ambitions.
          </p>
        </div>

        <div ref={revealRef} className="pf-contact-grid pf-reveal">
          {/* Info Column */}
          <div className="pf-contact-info">
            <div className="pf-contact-info-header">
              <img
                src={logoJdBlanc}
                alt="JihrelDev logo"
                className="pf-logo-mark pf-logo-mark-image"
              />
              <div>
                <h3>
                  Jihrel <span className="pf-contact-name-highlight">Dev</span>
                </h3>
                <p>Développeur Full-Stack</p>
              </div>
            </div>

            <p className="pf-contact-lead">
              Disponible immédiatement pour des missions freelance, contrats ou collaborations techniques exigeantes.
            </p>

            <ul className="pf-contact-list">
              {CONTACT_INFO.map((item) => {
                const isCopied = copiedItem === item.label;
                const canCopy = item.icon === FiMail || item.icon === FiPhone;

                return (
                  <li
                    key={item.label}
                    className={`pf-contact-item ${canCopy ? "clickable" : ""}`}
                    onClick={() => canCopy && handleCopy(item.value, item.label)}
                    title={canCopy ? "Cliquer pour copier" : undefined}
                  >
                    <div className="pf-contact-icon">
                      <item.icon size={17} />
                    </div>
                    <div className="pf-contact-details">
                      <span className="pf-contact-label font-mono">{item.label}</span>
                      <span className="pf-contact-value">{item.value}</span>
                    </div>
                    {canCopy && (
                      <span className="pf-item-copy-indicator" aria-hidden="true">
                        {isCopied ? <FiCheck size={14} className="copied-icon" /> : <FiCopy size={13} />}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="pf-contact-socials-wrap">
              <span className="pf-socials-title font-mono">Retrouvez-moi sur les réseaux</span>
              <div className="pf-contact-socials">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pf-icon-btn"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="pf-contact-form-wrap">
            <form className="pf-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="pf-form-row">
                <div className="field">
                  <label htmlFor="contact-name">Nom complet *</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={values.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="contact-email">Adresse email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={values.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="contact-subject">Sujet du projet</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Création d'une application web, refonte UI..."
                  value={values.subject}
                  onChange={handleChange("subject")}
                />
              </div>

              <div className="field">
                <label htmlFor="contact-message">Votre message *</label>
                <textarea
                  id="contact-message"
                  placeholder="Décrivez brièvement vos besoins, délais et attentes techniques..."
                  value={values.message}
                  onChange={handleChange("message")}
                  rows={5}
                  required
                />
              </div>

              <div className="pf-form-footer">
                <button
                  type="submit"
                  className="btn btn-primary pf-contact-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <Spinner size={16} color="#ffffff" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <FiSend size={15} />
                    </>
                  )}
                </button>

                {status === "sent" && (
                  <div className="pf-form-alert pf-alert-success">
                    <FiCheck size={16} />
                    <span>Votre message a été transmis avec succès !</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="pf-form-alert pf-alert-error">
                    <span>Une erreur est survenue, veuillez réessayer.</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}