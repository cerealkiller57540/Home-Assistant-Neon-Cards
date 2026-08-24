"""
pihole_update.py — Met à jour Pi-hole via SSH (paramiko) quand une mise à jour est détectée.
"""

import paramiko

PIHOLE_HOST = "192.168.1.53"
PIHOLE_USER = "ha-updater"
PIHOLE_KEY  = "/root/.ssh/pihole_ha_key"

NOTIFY_TARGET = "notify.mobile_app_pixel_9a"


def _ssh_update():
    """Lance pihole -up via SSH paramiko, retourne (success, output)."""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname=PIHOLE_HOST,
            username=PIHOLE_USER,
            key_filename=PIHOLE_KEY,
            timeout=15,
        )
        _, stdout, stderr = client.exec_command("sudo /usr/local/bin/pihole -up", timeout=300)
        out = stdout.read().decode()
        err = stderr.read().decode()
        rc  = stdout.channel.recv_exit_status()
        return rc == 0, out + err
    except Exception as e:
        return False, str(e)
    finally:
        client.close()


@state_trigger("update.pi_hole_core_update_available_2 == 'on'",
               "update.pi_hole_web_update_available_2 == 'on'",
               "update.pi_hole_ftl_update_available_2 == 'on'")
def pihole_auto_update(**kwargs):
    """Déclenché quand une mise à jour Pi-hole est disponible."""
    entity = kwargs.get("var_name", "inconnu")
    log.info(f"[pihole_update] Mise à jour détectée sur {entity} — lancement pihole -up")

    notify.mobile_app_pixel_9a(
        title="Pi-hole — Mise à jour en cours",
        message=f"Mise à jour détectée. Lancement de pihole -up…",
    )

    success, output = _ssh_update()

    if success:
        log.info(f"[pihole_update] Succès.\n{output}")
        notify.mobile_app_pixel_9a(
            title="Pi-hole — Mise à jour terminée ✓",
            message="pihole -up s'est terminé avec succès.",
        )
    else:
        log.error(f"[pihole_update] Échec.\n{output}")
        notify.mobile_app_pixel_9a(
            title="Pi-hole — Échec mise à jour ✗",
            message=f"Erreur : {output[:300]}",
        )
